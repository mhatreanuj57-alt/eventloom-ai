import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)), "server-only": fileURLToPath(new URL("./tests/setup.ts", import.meta.url)) } },
  test: { environment: "node", include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"], clearMocks: true },
});
