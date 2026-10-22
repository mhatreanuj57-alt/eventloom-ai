import type { EventBrief } from "@/types/event";
export function generationPrompt(event: EventBrief) {
  return "Create the initial celebration plan for this validated event brief. Preserve every constraint. Event data:\n" + JSON.stringify(event);
}
