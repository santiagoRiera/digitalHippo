import { User } from '@/payload-types'
import { ExpressContext } from '@/server'
import { TRPCError, initTRPC } from '@trpc/server'
import { PayloadRequest } from 'payload/types'

//Es quien nos brinda el router que nos deja definir los api endpoints
const t = initTRPC.context<ExpressContext>().create()
const middleware = t.middleware

//Middleware que se encarga de verificar si el usuario está autenticado
const isAuth = middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest

  const { user } = req as { user: User | null }

  if (!user || !user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: { user,} //we attach the user to the context
  })
})

export const router = t.router
export const publicProcedure = t.procedure //Cualquiera va a poder llamar este API endpoint. Es un public endpoint
export const privateProcedure = t.procedure.use(isAuth)
