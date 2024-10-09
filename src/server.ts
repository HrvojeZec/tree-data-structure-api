require("dotenv").config();
import express from "express";
import bodyParser from "body-parser";
import { globalErrorHandler } from "./controller/globalErrorHandler";
import nodesRouter from "./router/nodes-router";

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());

app.use("/nodes", nodesRouter);

app.use(globalErrorHandler);

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export { app, server };
