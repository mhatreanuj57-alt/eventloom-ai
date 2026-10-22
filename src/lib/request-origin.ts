import { AppError } from "./errors";
export function checkRequestOrigin(request: Request, required = false) {
  const origin = request.headers.get("origin");
  if (!origin && !required) return;
  const url = new URL(request.url);
  // Next may use an internal hostname; Host retains the browser-facing authority.
  const host = request.headers.get("host") ?? url.host;
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? url.protocol.slice(0, -1);
  if (!origin || origin !== `${protocol}://${host}`) throw new AppError(403, "INVALID_ORIGIN", "Please use this application to manage your events.");
}
