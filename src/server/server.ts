import http from "node:http";
import { envs } from "#/config/envs.js";
import logger from "#/shared/lib/pino/logger.js";
import app from "#/app/app.js";

const server = http.createServer(app);
let isShuttingDown = false;

function start(): void {
  server.on("error", (err) => {
    logger.error({ err }, "HTTP server error");
    process.exit(1);
  });

  server.listen(envs.PORT, () => {
    logger.info(
      `Server running on http://localhost:${envs.PORT} - [${envs.NODE_ENV}]`,
    );
  });
}

function shutdown(signal: string): void {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Signal ${signal} received`);
  server.close((err) => {
    if (err) {
      logger.error({ err }, "Failed to close HTTP server");
      process.exit(1);
    }

    logger.info("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, envs.SHUTDOWN_TIMEOUT_MS).unref();
}

export default {
  start,
  shutdown,
};
