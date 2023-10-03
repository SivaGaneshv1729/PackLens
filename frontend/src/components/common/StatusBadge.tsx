import { CheckCircle2, CircleAlert, CircleX, MinusCircle } from "lucide-react";
import type { CheckStatus, ComplianceStatus, Severity } from "@/types/compliance";

type BadgeStatus = CheckStatus | ComplianceStatus | Severity;

const config: Record<BadgeStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  compliant: { label: "Compliant", className: "border-emerald-200 bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
  passed: { label: "Passed", className: "border-emerald-200 bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
  non_compliant: { label: "Potential Violation", className: "border-rose-200 bg-rose-50 text-rose-700", Icon: CircleX },
  failed: { label: "Potential Violation", className: "border-rose-200 bg-rose-50 text-rose-700", Icon: CircleX },
  review_required: { label: "Requires Review", className: "border-amber-200 bg-amber-50 text-amber-700", Icon: CircleAlert },
  warning: { label: "Requires Review", className: "border-amber-200 bg-amber-50 text-amber-700", Icon: CircleAlert },
  not_applicable: { label: "Not applicable", className: "border-slate-200 bg-slate-50 text-slate-500", Icon: MinusCircle },
  high: { label: "High", className: "border-rose-200 bg-rose-50 text-rose-700", Icon: CircleX },
  medium: { label: "Medium", className: "border-amber-200 bg-amber-50 text-amber-700", Icon: CircleAlert },
  low: { label: "Low", className: "border-sky-200 bg-sky-50 text-sky-700", Icon: CircleAlert },
};

export function StatusBadge({ status, testId }: { status: BadgeStatus; testId?: string }) {
  const item = config[status];
  const Icon = item.Icon;
  return (
    <span data-testid={testId ?? `status-badge-${status}`} className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.className}`}>
      <Icon className="size-3.5" aria-hidden="true" />
      <span>{item.label}</span>
    </span>
  );
}

export function statusLabel(status: ComplianceStatus): string {
  return config[status].label;
}