import { corsGuard } from "#/app/middlewares/cors.js";
import { errorHandler } from "#/app/middlewares/error-handler.js";
import { httpLogger } from "#/app/middlewares/http-logger.js";
import { notFoundHandler } from "#/app/middlewares/not-found.js";
import { rateLimiter } from "#/app/middlewares/rate-limit.js";
import { envs } from "#/config/envs.js";
import express, { type Express } from "express";
import helmet from "helmet";

const app: Express = express();

app.set("trust proxy", envs.TRUST_PROXY);
app.disable("x-powered-by");
app.use(helmet());
app.use(corsGuard);
app.use(httpLogger);
app.use(rateLimiter);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
