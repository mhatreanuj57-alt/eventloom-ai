"use client";
import { useState } from "react";
import { Wallet, ArrowDownLeft, CircleDollarSign } from "lucide-react";
import { money } from "@/lib/utils";
import type { SavedEvent } from "@/types/plan";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusMessage } from "@/components/ui/status-message";
export function BudgetBreakdown({ event, onChange }: { event: SavedEvent; onChange: (patch: Partial<SavedEvent>) => void }) {
  const plan = event.plan;
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  if (!plan) return <div className="empty-state"><Wallet size={28} /><h3>Your budget is ready for a little shape.</h3><p>Generate a plan to start allocating costs and recording spending.</p></div>;
  const spent = Object.values(event.actualSpent).reduce((sum, value) => sum + value, 0);
  function record(id: string) {
    const value = amounts[id] ?? String((event.actualSpent[id] ?? 0) / 100);
    if (!/^\d+(\.\d{1,2})?$/.test(value)) { setError("Enter a non-negative amount with up to two decimal places."); return; }
    const [whole, fraction] = value.split(".");
    const amount = Number(whole) * 100 + Number((fraction ?? "").padEnd(2, "0"));
    if (!Number.isSafeInteger(amount) || amount > 10_000_000_000) { setError("This amount is too large."); return; }
    setError(""); onChange({ actualSpent: { ...event.actualSpent, [id]: amount } });
  }
  return <section><div className="detail-section-header"><div><span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span><h2>A thoughtful <em>budget.</em></h2></div><span className="soft-badge">All amounts in {event.brief.currency}</span></div><div className="budget-summary"><div><Wallet size={19} /><span>Your total budget</span><strong>{money(event.brief.budgetMinor, event.brief.currency)}</strong></div><div><CircleDollarSign size={19} /><span>Recorded spending</span><strong>{money(spent, event.brief.currency)}</strong></div><div className={spent > event.brief.budgetMinor ? "over-budget" : ""}><ArrowDownLeft size={19} /><span>{spent > event.brief.budgetMinor ? "Over budget" : "Room to work with"}</span><strong>{money(Math.abs(event.brief.budgetMinor - spent), event.brief.currency)}</strong></div></div><p className="muted text-sm mb-6">Plan allocations are estimates. Record actual totals as you confirm costs with vendors.</p>{error && <StatusMessage>{error}</StatusMessage>}<div className="budget-table"><div className="budget-table-head"><span>THE DETAILS</span><span>ESTIMATED</span><span>ACTUAL SPENDING</span></div>{plan.budgetItems.map((item, index) => <div className="budget-row" key={item.id}><div className="budget-category"><span className={`budget-color color-${index % 6}`} /><div><strong>{item.label}</strong><small>{item.note}</small></div></div><div className="budget-estimate"><strong>{money(item.amountMinor, event.brief.currency)}</strong><div className="budget-mini-bar"><span style={{ width: Math.max(3, item.amountMinor / event.brief.budgetMinor * 100) + "%" }} /></div></div><form className="spending-input" onSubmit={e => { e.preventDefault(); record(item.id); }}><Input type="number" step=".01" min="0" max="100000000" aria-label={"Actual spending for " + item.label} value={amounts[item.id] ?? String((event.actualSpent[item.id] ?? 0) / 100)} onChange={e => setAmounts(old => ({ ...old, [item.id]: e.target.value }))} /><Button type="submit" variant="outline" size="sm">Save</Button></form></div>)}<div className="budget-total"><strong>Estimated total</strong><strong>{money(plan.estimatedTotalMinor, event.brief.currency)}</strong><span>Verify quotes before booking</span></div></div></section>;
}
