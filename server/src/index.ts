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
app.use(cors())
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

const port = process.env.PORT || 8000

const _app = app.listen(port, () => {
  console.log(`Backend server listening on port http://localhost:${port}`)
})

export { _app }
