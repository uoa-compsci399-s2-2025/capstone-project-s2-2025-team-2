import { z } from "zod"

export const exampleSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
})

export type exampleSchemaType = z.infer<typeof exampleSchema>
