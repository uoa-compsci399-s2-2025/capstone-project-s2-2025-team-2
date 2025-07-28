import "dotenv/config"
import express, { Express } from "express";
import cors from "cors"
import { RegisterRoutes } from "./middleware/__generated__/routes"
import helmet from "helmet"
import { json, urlencoded } from "body-parser"

import * as swaggerJson from "./middleware/__generated__/swagger.json";
import * as swaggerUI from "swagger-ui-express";

const app: Express = express()

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(json());
app.use(helmet())
app.use(cors())

app.use("/swagger", swaggerUI.serve, swaggerUI.setup(swaggerJson));


RegisterRoutes(app);

const port = process.env.PORT || 3000;

const _app = app.listen(port, () => {
  console.log(`Backend server listening on port ${port}.`)
})

export { _app }
