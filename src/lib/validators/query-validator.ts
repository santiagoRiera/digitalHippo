import { z } from 'zod'

//Es para asegurarnos de que el user solo filtra por campos que permitimos y permitir un abuso de la API
export const QueryValidator = z.object({
  category: z.string().optional(),
  sort: z.enum(['asc', 'desc']).optional(),
  limit: z.number().optional(),
})

//TS type. Asi, no tendremos conflicto con el schema de zod
export type TQueryValidator = z.infer<typeof QueryValidator>
