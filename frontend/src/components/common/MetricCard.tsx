import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string | number; detail: string; icon: LucideIcon; tone: "blue" | "green" | "rose" | "amber" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <article data-testid={`metric-card-${label.toLowerCase().replaceAll(" ", "-")}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p data-testid={`metric-label-${label.toLowerCase().replaceAll(" ", "-")}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p data-testid={`metric-value-${label.toLowerCase().replaceAll(" ", "-")}`} className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <span className={`rounded-xl p-2.5 ${tones[tone]}`}><Icon className="size-5" aria-hidden="true" /></span>
      </div>
      <p data-testid={`metric-detail-${label.toLowerCase().replaceAll(" ", "-")}`} className="mt-4 text-sm text-slate-500">{detail}</p>
    </article>
  );
}