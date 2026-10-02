import { NotFoundError } from "#/shared/errors/app-error.js";
import type { RequestHandler } from "express";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
};
