import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { constantsRouter, seasonsRouter, teamsRouter } from "./controllers";
import { PORT } from "./environment";

const app = express();
const api = express.Router().use(cors()).use(bodyParser.json());

api.use(seasonsRouter).use(teamsRouter).use(constantsRouter);

app
  .use("/api", api)
  .listen(PORT, () => console.log(`Server is running on port ${PORT}`));
