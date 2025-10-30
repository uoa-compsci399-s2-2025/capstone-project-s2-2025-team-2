import "dotenv/config"
import express, { Express } from "express"
import cors from "cors"
import { RegisterRoutes } from "./middleware/__generated__/routes"
import helmet from "helmet"
import { json, urlencoded } from "body-parser"
import { ScheduleService } from "./service-layer/services/ScheduleService"
import * as swaggerJson from "./middleware/__generated__/swagger.json"
import * as swaggerUI from "swagger-ui-express"

const app: Express = express()
const corsOptions = {
  origin: [
    "https://colab.exchange",
    "https://54-206-209-62.sslip.io",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "https://testt.jefferyji.com",
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
app.use(express.json())

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  }),
)
app.use(json())
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  }),
)

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJson))

RegisterRoutes(app)

const scheduler = new ScheduleService()
scheduler.scheduleExpiryEmails()
scheduler.scheduleTurnExpiredReagentPrivate()

const port = process.env.PORT || 8000

const _app = app.listen(port, () => {
  console.log(`Backend server listening on port http://localhost:${port}`)
})

export { _app }
