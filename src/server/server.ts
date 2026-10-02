import http from 'node:http';
import { envs } from '#/config/envs.js';
import logger from '#/shared/lib/pino/logger.js';
import app from '#/app/app.js';

const server = http.createServer(app);

function start(): void {
  server.on('error', (err) => {
    logger.error({ err }, 'HTTP server error');
    process.exit(1);
  });

  server.listen(envs.PORT, () => {
    logger.info(`Server running on http://localhost:${envs.PORT} - [${envs.NODE_ENV}]`);
  });
}

let isShuttingDown = false;
let shutdownExitCode = 0;

function shutdown(signal: string, exitCode: number = 0): void {
  shutdownExitCode = Math.max(shutdownExitCode, exitCode);

  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Signal ${signal} received`);
  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Failed to close HTTP server');
      process.exit(1);
    }

    logger.info('HTTP server closed');
    process.exit(shutdownExitCode);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, envs.SHUTDOWN_TIMEOUT_MS).unref();
}

export default {
  start,
  shutdown,
};
