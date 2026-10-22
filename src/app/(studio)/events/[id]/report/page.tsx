import { EventReport } from "@/components/planner/event-report";
export const metadata = { title: "Celebration report" };
export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventReport id={id} />;
}
