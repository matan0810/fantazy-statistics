import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { seasonsRouter, teamsRouter } from "./controllers";
import { PORT } from "./environment";

const app = express();
const api = express.Router().use(cors()).use(bodyParser.json());

api.use(seasonsRouter).use(teamsRouter);

app
  .use("/api", api)
  .listen(PORT, () => console.log(`Server is running on port ${PORT}`));
