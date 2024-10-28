import { z } from 'zod'
import {
  privateProcedure,
  publicProcedure,
  router,
} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { stripe } from '../lib/stripe'
import type Stripe from 'stripe'

export const paymentRouter = router({
  createSession: privateProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx
      let { productIds } = input

      if (productIds.length === 0) {
        throw new TRPCError({ code: 'BAD_REQUEST' })
      }

      const payload = await getPayloadClient()

      const { docs: products } = await payload.find({
        collection: 'products',
        where: {
          id: {
            in: productIds,
          },
        },
      })

      const filteredProducts = products.filter((prod) =>
        Boolean(prod.priceId)
      )

      //Creamos la orden
      const order = await payload.create({
        collection: 'orders',
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id.toString()),
          user: user.id,
        },
      })

      //Asi podemos aregar 2 cosas dentro: transaction fee y products
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        []

        //Products
      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId?.toString() || '',
          quantity: 1,
        })
      })

      //Transaction fee. Producto que creamos en stripe
      line_items.push({
        price: 'price_1QDwz609kLMcYpFRJsBcPy9R',
        quantity: 1, //Lo aplicamos una vez
        adjustable_quantity: {
          enabled: false,
        },
      })


      //Checkout session
      try {
        const stripeSession =
          await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
            payment_method_types: ['card'],
            mode: 'payment',
            metadata: {
                userId: user.id,
                orderId: order.id
            },
            line_items,
          })

          //return para el frontend
        return { url: stripeSession.url }
      } catch (err) {
        console.error('Error creating Stripe Checkout session:', err);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Could not create checkout session.' });
      }
    }),
    
  pollOrderStatus: privateProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input

      const payload = await getPayloadClient()

      const { docs: orders } = await payload.find({
        collection: 'orders',
        where: {
          id: {
            equals: orderId,
          },
        },
      })

      if (!orders.length) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const [order] = orders

      return { isPaid: order._isPaid }
    }),
})
