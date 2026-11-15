import { describe, expect, it } from "vitest";
import { crearLimitePreguntas } from "../src/modules/module4/chat.rate-limit.js";

describe("chat question rate limit", () => {
  it("allows 20 messages per user per minute and resets after the window", () => {
    let now = 1_000;
    const limitar = crearLimitePreguntas(() => now);

    for (let i = 0; i < 20; i += 1) expect(limitar("user-1")).toBe(0);
    expect(limitar("user-1")).toBe(60);
    expect(limitar("user-2")).toBe(0);
    now += 60_000;
    expect(limitar("user-1")).toBe(0);
  });
});
