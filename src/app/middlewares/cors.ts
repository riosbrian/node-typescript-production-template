import { envs } from "#/config/envs.js";
import { ForbiddenError } from "#/shared/errors/app-error.js";
import cors from "cors";

export const corsGuard = cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (envs.CORS_ORIGINS.includes(origin)) return callback(null, true);
    callback(new ForbiddenError(`Origin not allowed: ${origin}`));
  },
  credentials: true,
});
