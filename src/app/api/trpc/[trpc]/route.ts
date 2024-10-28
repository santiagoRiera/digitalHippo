import { appRouter } from '@/trpc'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter, //Nuestro backend
    // @ts-expect-error context already passed from express middleware
    createContext: () => ({}),
  })
}

//Se le puede hacer GET y POST a este Api endpoint
export { handler as GET, handler as POST }
