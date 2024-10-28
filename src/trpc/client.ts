import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './'

//El frontend ahora conoce el type del back
export const trpc = createTRPCReact<AppRouter>({})
