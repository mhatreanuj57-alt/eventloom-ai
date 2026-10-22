export class AppError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string[]>) { super(message); this.name = "AppError"; }
}
export function apiError(error: unknown) {
  if (error instanceof AppError) return error;
  return new AppError(500, "INTERNAL_ERROR", "Something went wrong. Your event details are safe; please try again.");
}
