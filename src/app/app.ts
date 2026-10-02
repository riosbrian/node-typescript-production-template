import { errorHandler } from "#/app/middlewares/error-handler.js";
import { httpLogger } from "#/app/middlewares/http-logger.js";
import { notFoundHandler } from "#/app/middlewares/not-found.js";
import express, { type Express } from "express";

const app: Express = express();

app.disable("x-powered-by");
app.use(httpLogger);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
