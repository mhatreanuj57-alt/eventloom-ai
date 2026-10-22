import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";
export function StatusMessage({ children, kind = "error" }: { children: React.ReactNode; kind?: "error" | "success" | "loading" }) {
  return <div className={`status-message status-${kind}`} role={kind === "error" ? "alert" : "status"}>
    {kind === "error" ? <AlertCircle size={18} /> : kind === "success" ? <CheckCircle2 size={18} /> : <LoaderCircle size={18} className="spin" />}
    <div>{children}</div>
  </div>;
}
