import "dotenv/config";
import { z } from "zod";

const booleanString = z
  .enum(["true", "false"])
  .transform((value) => value === "true");

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.string().default("info"),
  DATABASE_URL: z.string().url(),
  FASTAPI_BASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  JWT_ACCESS_TTL: z.string().default("15m"),
  SESSION_IDLE_TIMEOUT_MINUTES: z.coerce.number().int().positive().default(30),
  SESSION_DEFAULT_DAYS: z.coerce.number().int().positive().default(7),
  SESSION_REMEMBER_DAYS: z.coerce.number().int().positive().default(30),
  AUTH_TEST_ADMIN_EMAIL: z.string().email().optional(),
  SMTP_HOST: z.string().min(1).default("smtp.gmail.com"),
  SMTP_PORT: z.coerce.number().int().positive().default(465),
  SMTP_SECURE: booleanString.default("true"),
  SMTP_USER: z.string().min(1).optional(),
  SMTP_PASS: z.string().min(1).optional(),
  MAIL_FROM: z.string().min(1).optional(),
  MAX_FILE_SIZE_MB: z.coerce.number().int().positive().max(15).default(15),
  MAX_BATCH_SIZE: z.coerce.number().int().min(1).max(10).default(10),
  APP_ORIGIN: z.string().url().default("http://localhost:5173"),
  GEMINI_API_KEY: z.string().min(1).optional(),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  GEMINI_LIVE_TESTS: booleanString.default("false"),
  DOCUMENT_STORAGE_PATH: z.string().default("./storage/documents"),
});

export const env = schema.parse(process.env);
