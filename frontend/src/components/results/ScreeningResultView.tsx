import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ChevronDown, CircleHelp, CircleX, FileBarChart, FileText, MapPin, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import type { ComplianceResult, ComplianceStatus, Violation } from "@/types/compliance";

const overallPresentation: Record<ComplianceStatus, { label: string; caption: string; Icon: typeof CheckCircle2; shell: string; icon: string }> = {
  compliant: { label: "COMPLIANT", caption: "All returned checks passed for this screening.", Icon: CheckCircle2, shell: "border-emerald-200 bg-emerald-50/60", icon: "bg-emerald-600 text-white" },
  review_required: { label: "REQUIRES REVIEW", caption: "One or more declarations need human verification.", Icon: TriangleAlert, shell: "border-amber-200 bg-amber-50/60", icon: "bg-amber-500 text-white" },
  non_compliant: { label: "POTENTIAL VIOLATION", caption: "The analysis returned items that may require corrective action.", Icon: CircleX, shell: "border-rose-200 bg-rose-50/60", icon: "bg-rose-600 text-white" },
};

interface ScreeningResultViewProps {
  result: ComplianceResult;
  formattedDate: string;
  onBack: () => void;
  onGenerateReport: () => void;
  onNewAnalysis: () => void;
  onViewViolation: (violationId: string) => void;
}

export default function ScreeningResultView({ result, formattedDate, onBack, onGenerateReport, onNewAnalysis, onViewViolation }: ScreeningResultViewProps) {
  const [expandedCheckId, setExpandedCheckId] = useState<string | null>(null);
  const firstLocatedViolation = result.violations.find((violation) => violation.location)?.id ?? null;
  const [focusedViolationId, setFocusedViolationId] = useState<string | null>(firstLocatedViolation);
  const focusedViolation = result.violations.find((violation) => violation.id === focusedViolationId && violation.location);
  const notDetected = useMemo(() => result.checks.filter((check) => !check.detectedValue).length, [result.checks]);
  const overall = overallPresentation[result.status];
  const OverallIcon = overall.Icon;

  return (
    <div data-testid="compliance-result-page" className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button data-testid="result-back-button" onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="size-4" />Back</button>
          <p data-testid="result-eyebrow" className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Screening complete</p>
          <h1 data-testid="result-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Compliance Screening Result</h1>
          <p data-testid="result-analysis-date" className="mt-2 text-sm text-slate-500">Analyzed {formattedDate} · <span className="font-mono">{result.analysisId}</span></p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button data-testid="result-report-button" onClick={onGenerateReport} className="inline-flex h-11 items-center justify-center gap-2 border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"><FileBarChart className="size-4" />Generate Report</button>
          <button data-testid="result-new-analysis-button" onClick={onNewAnalysis} className="inline-flex h-11 items-center justify-center gap-2 bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"><RotateCcw className="size-4" />New screening</button>
        </div>
      </header>

      <section data-testid="result-overall-status" className={`border px-5 py-5 sm:px-7 ${overall.shell}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4"><span className={`flex size-12 shrink-0 items-center justify-center rounded-full ${overall.icon}`}><OverallIcon className="size-6" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Overall result</p><p data-testid="result-overall-label" className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-950">{overall.label}</p><p data-testid="result-overall-caption" className="mt-1 text-sm text-slate-600">{overall.caption}</p></div></div>
          {result.score !== undefined && <div data-testid="result-score-summary" className="border-l-0 border-slate-200 sm:border-l sm:pl-7"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Screening score</p><p data-testid="result-score-value" className="mt-1 font-heading text-2xl font-semibold text-slate-950">{result.score}<span className="text-base text-slate-400"> / 100</span></p><p className="mt-1 text-[11px] text-slate-500">Provided by the analysis response</p></div>}
        </div>
      </section>

      <section data-testid="result-summary-metrics" className="grid grid-cols-2 border-y border-slate-200 bg-white sm:grid-cols-4">
        <SummaryItem icon={Check} label="Passed" value={result.summary.passed} tone="green" testId="result-passed-checks" />
        <SummaryItem icon={TriangleAlert} label="Warnings" value={result.summary.warnings} tone="amber" testId="result-warning-count" />
        <SummaryItem icon={CircleX} label="Violations" value={result.summary.failed} tone="rose" testId="result-failed-checks" />
        <SummaryItem icon={CircleHelp} label="Not Detected" value={notDetected} tone="slate" testId="result-not-detected-count" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div data-testid="product-evidence-panel" className="self-start border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] lg:sticky lg:top-24">
          <div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Visual source</p><h2 data-testid="product-evidence-title" className="mt-1 font-heading text-xl font-semibold text-slate-950">Product Evidence</h2></div>{focusedViolation?.location && <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600"><MapPin className="size-3.5" />Area identified</span>}</div>
          <div className="relative overflow-hidden bg-slate-100">
            {result.package.imageUrl && !result.package.fileType.includes("pdf") ? <img data-testid="result-package-image" src={result.package.imageUrl} alt={`${result.package.productName} package evidence`} className="max-h-[520px] min-h-80 w-full object-contain" /> : <div data-testid="result-document-evidence" className="flex min-h-80 flex-col items-center justify-center text-slate-500"><FileText className="size-12" /><span className="mt-3 text-xs font-bold uppercase tracking-wider">Uploaded package document</span></div>}
            {focusedViolation?.location && <div data-testid="result-image-highlight" className="absolute border-2 border-rose-500 bg-rose-500/15 shadow-[0_0_0_9999px_rgba(15,23,42,0.08)]" style={{ left: `${focusedViolation.location.x}%`, top: `${focusedViolation.location.y}%`, width: `${focusedViolation.location.width}%`, height: `${focusedViolation.location.height}%` }}><span className="absolute -top-7 left-0 whitespace-nowrap bg-rose-600 px-2 py-1 text-[10px] font-bold text-white">Returned location</span></div>}
          </div>
          <div className="mt-4 border-t border-slate-100 pt-4"><h3 data-testid="result-product-name" className="font-heading text-lg font-semibold text-slate-900">{result.package.productName}</h3><p data-testid="result-manufacturer" className="mt-1 text-sm text-slate-500">{result.package.manufacturer ?? "Not provided"}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500"><span>{result.package.category ?? "Not provided"}</span><span>{result.package.fileName}</span></div></div>
        </div>

        <div data-testid="detected-declarations-panel" className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Extracted from package</p><h2 data-testid="detected-declarations-title" className="mt-1 font-heading text-xl font-semibold text-slate-950">Detected Declarations</h2><p data-testid="detected-declarations-description" className="mt-1 text-sm text-slate-500">Values and statuses below come directly from the existing analysis response.</p></div>
          <div data-testid="compliance-checklist" className="divide-y divide-slate-100">
            {result.checks.map((check) => {
              const needsAttention = check.status === "warning" || check.status === "failed";
              const expanded = expandedCheckId === check.id;
              return (
                <article data-testid={`check-row-${check.id}`} key={check.id} className="px-5 py-5 sm:px-6">
                  <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr_auto] sm:items-center">
                    <p data-testid={`check-requirement-${check.id}`} className="text-sm font-semibold text-slate-800">{check.requirement}</p>
                    <p data-testid={`check-value-${check.id}`} className="text-sm text-slate-600">{check.detectedValue ?? "Not detected"}</p>
                    <div className="flex items-center justify-between gap-3 sm:justify-end"><StatusBadge status={check.status} testId={`check-status-${check.id}`} />{needsAttention && <button data-testid={`check-details-button-${check.id}`} type="button" aria-expanded={expanded} onClick={() => setExpandedCheckId(expanded ? null : check.id)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">Details<ChevronDown className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} /></button>}</div>
                  </div>
                  {expanded && <div data-testid={`check-details-${check.id}`} className={`mt-4 grid gap-4 border-l-2 px-4 py-3 sm:grid-cols-3 ${check.status === "failed" ? "border-rose-500 bg-rose-50/60" : "border-amber-500 bg-amber-50/60"}`}><Detail label="Detected" value={check.detectedValue} /><Detail label="Why" value={check.reason} /><Detail label="Recommended action" value={check.recommendation} /></div>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section data-testid="result-violations-card" className="border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Follow-up</p><h2 data-testid="result-violations-title" className="mt-1 font-heading text-xl font-semibold text-slate-950">Items Requiring Attention</h2><p data-testid="result-violations-description" className="mt-1 text-sm text-slate-500">Only issues returned by the existing screening response are shown.</p></div><span data-testid="result-violation-count" className="shrink-0 text-sm font-semibold text-slate-600">{result.violations.length} items</span></div>
        {result.violations.length ? <div className="divide-y divide-slate-100">{result.violations.map((violation) => <ViolationRow key={violation.id} violation={violation} onFocus={() => setFocusedViolationId(violation.id)} onView={() => onViewViolation(violation.id)} />)}</div> : <div data-testid="result-no-violations" className="flex items-center gap-3 px-5 py-6 text-sm text-emerald-700"><CheckCircle2 className="size-5" />No potential violations were returned for this analysis.</div>}
      </section>

      <div data-testid="result-disclaimer" className="flex items-start gap-3 border-l-2 border-blue-500 bg-blue-50/50 px-4 py-3 text-xs leading-5 text-slate-600"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-600" />This screening is a compliance-assistance output, not a legally binding determination. Final verification remains with the appropriate authority.</div>
    </div>
  );
}

function SummaryItem({ icon: Icon, label, value, tone, testId }: { icon: typeof Check; label: string; value: number; tone: "green" | "amber" | "rose" | "slate"; testId: string }) {
  const tones = { green: "text-emerald-600", amber: "text-amber-600", rose: "text-rose-600", slate: "text-slate-500" };
  return <div className="flex items-center gap-3 border-b border-r border-slate-200 px-4 py-4 last:border-r-0 sm:border-b-0 sm:px-5"><Icon className={`size-5 ${tones[tone]}`} aria-hidden="true" /><div><p data-testid={testId} className="font-heading text-xl font-semibold text-slate-950">{value}</p><p className="text-xs font-medium text-slate-500">{label}</p></div></div>;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p><p className="mt-1 text-xs leading-5 text-slate-700">{value ?? "Not provided"}</p></div>;
}

function ViolationRow({ violation, onFocus, onView }: { violation: Violation; onFocus: () => void; onView: () => void }) {
  return <article data-testid={`result-violation-${violation.id}`} className="grid gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1fr_1fr_auto] lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Field</p><p className="mt-1 text-sm font-semibold text-slate-900">{violation.title}</p><div className="mt-2 flex items-center gap-2"><span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700"><CircleX className="size-3.5" />Potential Violation</span><StatusBadge status={violation.severity} testId={`result-violation-status-${violation.id}`} /></div></div><div className="grid gap-3 sm:grid-cols-2"><Detail label="Detected" value={violation.detectedInformation} /><Detail label="Recommended action" value={violation.recommendation} /></div><div className="flex flex-wrap gap-2 lg:justify-end">{violation.location && <button data-testid={`result-violation-focus-${violation.id}`} type="button" onClick={onFocus} className="inline-flex h-9 items-center gap-1.5 border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:border-rose-300 hover:text-rose-700"><MapPin className="size-3.5" />View on product</button>}<button data-testid={`result-violation-view-${violation.id}`} type="button" onClick={onView} className="inline-flex h-9 items-center gap-1.5 bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800">View Details<ArrowRight className="size-3.5" /></button></div></article>;
}