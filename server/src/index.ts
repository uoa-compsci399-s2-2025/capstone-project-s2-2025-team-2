import "dotenv/config"
import express, { Express, Request, Response, NextFunction } from "express"
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

// Global error handler to expose TSOA validation errors (ValidateError) and other runtime errors.
// This captures the validation error thrown by TSOA's templateService.getValidatedArgs and
// logs the details so you can see which parameter/field failed validation.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err)

  // TSOA's ValidateError contains details about which field failed validation.
  if (err && err.name === "ValidateError") {
    // err.fields typically contains a map of field -> error
    return res.status(err.status || 400).json({
      message: err.message,
      fields: err.fields,
    })
  }

  // Generic error response
  return res.status(err?.status || 500).json({ message: err?.message || "Internal Server Error" })
})

const scheduler = new ScheduleService()
scheduler.scheduleExpiryEmails()

const port = process.env.PORT || 8000

const _app = app.listen(port, () => {
  console.log(`Backend server listening on port http://localhost:${port}`)
})

export { _app }
