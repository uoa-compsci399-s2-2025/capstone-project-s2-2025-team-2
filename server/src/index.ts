import "dotenv/config"
import express, { Express } from "express"
import cors from "cors"
import { RegisterRoutes } from "./middleware/__generated__/routes"
import helmet from "helmet"
import { json, urlencoded } from "body-parser"

import * as swaggerJson from "./middleware/__generated__/swagger.json"
import * as swaggerUI from "swagger-ui-express"

const app: Express = express()
app.use(express.json())

const corsOptions = {
  origin: [
    "https://chemically-d-client.vercel.app",

    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  credentials: true, // Allow cookies/auth headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "X-CSRF-Token",
  ],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}

app.use(cors(corsOptions))
// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  }),
)
app.use(json())
app.use(helmet())
app.use(cors())

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJson))

RegisterRoutes(app)

const port = process.env.PORT || 8000

const _app = app.listen(port, () => {
  console.log(`Backend server listening on port http://localhost:${port}`)
})

export { _app }
