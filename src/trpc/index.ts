import { z } from 'zod'
import { authRouter } from './auth-router'
import { publicProcedure, router } from './trpc'
import { QueryValidator } from '../lib/validators/query-validator'
import { getPayloadClient } from '../get-payload'
import { paymentRouter } from './payment-router'

//router nos deja definir cuostoms type safe API endpoints. Esto es nuestro backend
export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,

  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(), //cursor=ultimo elemento que es renderizado. Cuando el user scrollea, cursor empieza a cagar la siguiente pagina de productos para el infiniteQuery
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input
      const { sort, limit, ...queryOpts } = query  //...queryOpts es el resto de las propiedades, osea category. La importamos asi pq es una propiedad especial y de esta forma es facilmente extendible

      const payload = await getPayloadClient() //obtenemos el client asi interactuamos con la db

      const parsedQueryOpts: Record<
        string,
        { equals: string }
      > = {}

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = { //tomamos la category y la convertimos en algo que nuestro cms entiende en el query
          equals: value,
        }
      })

      const page = cursor || 1 //o 1 pq fetcheamos desde el primer registro de la db

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: 'products',
        where: {
          approvedForSale: {
            equals: 'approved',
          },
          ...parsedQueryOpts,
        },
        sort,
        depth: 1,
        limit,
        page,
      })

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      }
    }),
})

export type AppRouter = typeof appRouter
