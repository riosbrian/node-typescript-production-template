import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
});

const parse = envSchema.safeParse(process.env);

if (!parse.success) {
  console.error("Invalid environment variables", parse.error.issues);
  process.exit(1);
}

export const envs = parse.data;
