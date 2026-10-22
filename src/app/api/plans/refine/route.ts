import { handlePlanRequest } from "@/lib/plan-route";
export const runtime = "nodejs";
export const maxDuration = 90;
export async function POST(request: Request) { return handlePlanRequest(request, "refine"); }
