import server from "#/server/server.js";

(() => {
  server.start();
  process.on("SIGTERM", () => server.shutdown("SIGTERM"));
  process.on("SIGINT", () => server.shutdown("SIGINT"));
})();
