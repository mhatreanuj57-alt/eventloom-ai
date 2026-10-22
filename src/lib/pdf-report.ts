import "regenerator-runtime/runtime";
import { PDFDocument, rgb, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { SavedEvent } from "@/types/plan";
import { savedEventSchema } from "./validation/plan-output";
import { eventReport } from "./event-report";

export async function createEventPdf(event: SavedEvent, fontBytes: Uint8Array[]) {
  savedEventSchema.parse(event);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fonts = await Promise.all(fontBytes.map(bytes => pdf.embedFont(bytes, { subset: true })));
  const coverage = fonts.map(font => new Set(font.getCharacterSet()));
  const fontFor = (text: string) => {
    const index = coverage.findIndex(set => [...text].every(char => /\s/u.test(char) || set.has(char.codePointAt(0)!)));
    if (index < 0) throw new Error("This report uses characters outside the PDF fonts. Open the readable report and use your browser's Print / Save as PDF instead.");
    return fonts[index];
  };
  pdf.setTitle(event.brief.title);
  pdf.setAuthor("EventLoom AI");
  pdf.setLanguage("en");
  const width = 499;
  let page = pdf.addPage([595, 842]);
  let y = 790;
  const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
  function line(runs: { text: string; font: PDFFont }[], size: number) {
    if (y < 65) { page = pdf.addPage([595, 842]); y = 790; }
    let x = 48;
    for (const run of runs) {
      page.drawText(run.text, { x, y, size, font: run.font, color: rgb(.16, .20, .15) });
      x += run.font.widthOfTextAtSize(run.text, size);
    }
    y -= size * 1.65;
  }
  function paragraph(text: string, size = 10) {
    let runs: { text: string; font: PDFFont }[] = [];
    let length = 0;
    for (const word of text.replace(/\s+/gu, " ").trim().split(/(?<=\s)/u)) {
      // Long unbroken model text wraps by grapheme instead of overflowing the page.
      const chunks = [...segmenter.segment(word)].map(item => item.segment);
      const wordWidth = chunks.reduce((sum, char) => sum + fontFor(char).widthOfTextAtSize(char, size), 0);
      if (length && length + wordWidth > width) { line(runs, size); runs = []; length = 0; }
      for (const char of chunks) {
        const font = fontFor(char);
        const advance = font.widthOfTextAtSize(char, size);
        if (length + advance > width) { line(runs, size); runs = []; length = 0; }
        const last = runs.at(-1);
        if (last?.font === font) last.text += char; else runs.push({ text: char, font });
        length += advance;
      }
    }
    if (runs.length) line(runs, size);
    y -= 6;
  }
  paragraph("EVENTLOOM AI / CELEBRATION REPORT", 10);
  paragraph(event.brief.title, 23);
  for (const section of eventReport(event)) {
    if (y < 110) { page = pdf.addPage([595, 842]); y = 790; }
    y -= 12;
    paragraph(section.title, 15);
    for (const text of section.lines) paragraph(text);
  }
  const pages = pdf.getPages();
  pages.forEach((item, index) => item.drawText(`EventLoom AI  |  ${index + 1} / ${pages.length}`, { x: 48, y: 32, size: 8, font: fonts[0], color: rgb(.4, .4, .4) }));
  return pdf.save();
}

export async function downloadEventPdf(event: SavedEvent) {
  const fonts = await Promise.all(["NotoSans-Regular.ttf", "NotoSansDevanagari-Regular.ttf"].map(async name => {
    const response = await fetch(`/fonts/${name}`, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error("Report fonts couldn't be loaded. Please try again or print the readable report.");
    return new Uint8Array(await response.arrayBuffer());
  }));
  const bytes = await createEventPdf(event, fonts);
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `eventloom-${event.brief.title.replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60) || "celebration"}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
