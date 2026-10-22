import { expect, it } from "vitest";
import { checkRequestOrigin } from "@/lib/request-origin";
it("accepts the external authority behind Next's internal URL", () => {
  expect(() => checkRequestOrigin(new Request("http://localhost:3100/api/events", { headers: { Host: "127.0.0.1:3100", Origin: "http://127.0.0.1:3100" } }), true)).not.toThrow();
  expect(() => checkRequestOrigin(new Request("http://internal/api/events", { headers: { Host: "events.example", Origin: "https://events.example", "X-Forwarded-Proto": "https" } }), true)).not.toThrow();
});
it("rejects foreign and absent origins for cookie-authenticated mutations", () => {
  for (const origin of ["https://evil.example", "null", ""]) expect(() => checkRequestOrigin(new Request("https://events.example/api/events", { headers: { Origin: origin } }), true)).toThrow();
});
