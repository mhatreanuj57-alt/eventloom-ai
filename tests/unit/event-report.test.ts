import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { eventReport } from "@/lib/event-report";
import { createEventPdf } from "@/lib/pdf-report";
import { sampleEvents } from "@/lib/sample-events";
const fonts = () => Promise.all(["NotoSans-Regular.ttf", "NotoSansDevanagari-Regular.ttf"].map(name => readFile(new URL(`../../public/fonts/${name}`, import.meta.url))));
describe("downloadable celebration reports", () => {
  it("includes the brief, actual expenses, timelines, progress and caveats", () => {
    const event = structuredClone(sampleEvents[0]);
    event.actualSpent[event.plan!.budgetItems[0].id] = 12345;
    event.completedTasks = [event.plan!.checklist[0].id];
    const report = JSON.stringify(eventReport(event));
    for (const text of ["₹123.45", "Done:", "Event-day timeline", "Vendor checklist", "Before you book", "Illustrative sample"]) expect(report).toContain(text);
  });
  it("downloads a real multipage PDF with embedded Unicode fonts", async () => {
    const event = structuredClone(sampleEvents[0]); event.brief.title = "Meera & Aarav / आनंद सोहळा";
    event.plan!.summary = "A".repeat(600);
    const bytes = await createEventPdf(event, await fonts());
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getTitle()).toBe(event.brief.title);
    expect(pdf.getPageCount()).toBeGreaterThan(1);
    expect(pdf.getPages().every(page => page.getWidth() === 595)).toBe(true);
  });
  it("exports a draft without inventing a plan", async () => {
    const event = { ...sampleEvents[0], plan: null, source: "draft" as const, actualSpent: {}, vendorStatus: {}, completedTasks: [] };
    expect(JSON.stringify(eventReport(event))).toContain("Draft; no AI plan");
    expect((await createEventPdf(event, await fonts())).length).toBeGreaterThan(1000);
  });
  it("offers the readable report instead of silently dropping unsupported characters", async () => {
    const event = { ...sampleEvents[0], brief: { ...sampleEvents[0].brief, title: "Celebration 🎉" } };
    await expect(createEventPdf(event, await fonts())).rejects.toThrow(/readable report/);
  });
});
