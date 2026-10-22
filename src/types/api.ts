import type { EventBrief } from "./event";
import type { EventPlan } from "./plan";
export interface PlanResponse { data: EventPlan; effectiveEvent: EventBrief; requestId: string }
export interface ApiFailure { error: { code: string; message: string; fields?: Record<string, string[]> }; requestId: string }
