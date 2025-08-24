import { exampleSchema, type exampleSchemaType } from "./example-schema"

const mockData1: exampleSchemaType = {
  id: 1,
  name: "Logan",
  email: "email@example.com",
}

const mockData2: exampleSchemaType = {
  id: 2,
  name: "Logan",
}

const validateAsync = async (data: exampleSchemaType) => {
  await exampleSchema.parseAsync(data)
}

try {
  exampleSchema.parse(mockData1)
  validateAsync(mockData2)
} catch (err) {
  throw Error(err)
}
