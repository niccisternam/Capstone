import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { errorHandler } from "../src/shared/errors/error-handler.js";
import { createRateLimiter } from "../src/shared/http/rate-limit.js";

function buildApp(now: () => number) {
  const app = express();
  app.use((req, _res, next) => {
    (req as unknown as { log: unknown }).log = { error() {} };
    next();
  });
  app.post(
    "/limited",
    createRateLimiter({ name: "test", max: 2, windowMs: 60_000, now }),
    (_req, res) => {
      res.status(204).send();
    },
  );
  app.use(errorHandler);
  return app;
}

describe("createRateLimiter", () => {
  it("responde 429 con Retry-After al superar el máximo y se reinicia con la ventana", async () => {
    let time = 0;
    const app = buildApp(() => time);

    await request(app).post("/limited").expect(204);
    await request(app).post("/limited").expect(204);
    const blocked = await request(app).post("/limited").expect(429);
    expect(blocked.body.error.code).toBe("RATE_LIMITED");
    expect(blocked.headers["retry-after"]).toBe("60");

    time = 60_000;
    await request(app).post("/limited").expect(204);
  });
});
