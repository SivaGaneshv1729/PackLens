import { Check, FileCheck2, FileOutput, FileText, Image, ListChecks, Loader2, ScanText, SearchCheck } from "lucide-react";
import type { PackageRecord } from "@/types/compliance";

export const ANALYSIS_STEPS = [
  { title: "Image Received", message: "Reading product label...", icon: Image },
  { title: "OCR Extraction", message: "Extracting mandatory declarations...", icon: ScanText },
  { title: "Declaration Detection", message: "Detecting package information...", icon: SearchCheck },
  { title: "Compliance Checking", message: "Checking compliance requirements...", icon: ListChecks },
  { title: "Report Preparation", message: "Preparing your screening result...", icon: FileOutput },
] as const;

export default function AnalysisProcess({ packageRecord, activeStep }: { packageRecord: PackageRecord; activeStep: number }) {
  const currentMessage = ANALYSIS_STEPS[Math.min(activeStep, ANALYSIS_STEPS.length - 1)]?.message ?? "Preparing your screening result...";
  return (
    <div data-testid="analysis-page" className="mx-auto max-w-5xl space-y-6">
      <header>
        <p data-testid="analysis-eyebrow" className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Screening in progress</p>
        <h1 data-testid="analysis-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Analyzing Product Label</h1>
        <p data-testid="analysis-description" className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Your package is moving through the prototype inspection workflow. No compliance decision is calculated in this browser.</p>
      </header>

      <section data-testid="analysis-progress-card" className="grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.06)] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative min-h-80 overflow-hidden bg-slate-950 lg:min-h-[560px]">
          {packageRecord.imageUrl && !packageRecord.fileType.includes("pdf") ? (
            <img data-testid="analysis-package-preview" src={packageRecord.imageUrl} alt={`${packageRecord.productName} package`} className="absolute inset-0 size-full object-cover opacity-80" />
          ) : (
            <div data-testid="analysis-document-preview" className="absolute inset-0 flex flex-col items-center justify-center text-slate-300"><FileText className="size-14" /><span className="mt-3 text-xs font-bold uppercase tracking-wider">Package document</span></div>
          )}
          <div className="absolute inset-0 bg-slate-950/25" />
          <div data-testid="analysis-scan-line" className="analysis-scan-line absolute inset-x-5 h-px bg-cyan-300 shadow-[0_0_18px_4px_rgba(103,232,249,0.7)]" />
          <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-slate-950/85 p-5 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300"><Loader2 className="size-3.5 animate-spin" />Active inspection</div>
            <p data-testid="analysis-package-name" className="mt-2 font-heading text-xl font-semibold">{packageRecord.productName}</p>
            <p data-testid="analysis-file-name" className="mt-1 truncate text-sm text-slate-300">{packageRecord.fileName}</p>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-9">
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2"><span className="relative flex size-2.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-400 opacity-60" /><span className="relative inline-flex size-2.5 rounded-full bg-blue-600" /></span><p data-testid="analysis-progress-label" className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Analysis active</p></div>
            <p data-testid="analysis-progress-subtitle" className="mt-3 font-heading text-xl font-semibold text-slate-900">{currentMessage}</p>
          </div>

          <div data-testid="analysis-step-list" className="mt-5">
            {ANALYSIS_STEPS.map((item, index) => {
              const completed = index < activeStep;
              const processing = index === activeStep && activeStep < ANALYSIS_STEPS.length;
              const state = completed ? "Completed" : processing ? "Processing" : "Waiting";
              const Icon = item.icon;
              return (
                <div data-testid={`analysis-step-${index}`} key={item.title} className={`grid grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-slate-100 py-4 last:border-b-0 ${processing ? "text-blue-700" : ""}`}>
                  <span className={`flex size-10 items-center justify-center rounded-full border ${completed ? "border-emerald-200 bg-emerald-50 text-emerald-600" : processing ? "border-blue-200 bg-blue-50 text-blue-600" : "border-slate-200 bg-slate-50 text-slate-400"}`}>{completed ? <Check className="size-4" /> : processing ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}</span>
                  <div><p data-testid={`analysis-step-title-${index}`} className={`text-sm font-semibold ${completed || processing ? "text-slate-900" : "text-slate-500"}`}><span className="mr-2 font-mono text-xs text-slate-400">{String(index + 1).padStart(2, "0")}</span>{item.title}</p><p data-testid={`analysis-step-message-${index}`} className="mt-1 text-xs text-slate-500">{item.message}</p></div>
                  <span data-testid={`analysis-step-state-${index}`} className={`text-[10px] font-bold uppercase tracking-wider ${completed ? "text-emerald-600" : processing ? "text-blue-600" : "text-slate-400"}`}>{state}</span>
                </div>
              );
            })}
          </div>

          <div data-testid="analysis-prototype-note" className="mt-6 flex items-start gap-2 border-l-2 border-slate-300 pl-3 text-xs leading-5 text-slate-500"><FileCheck2 className="mt-0.5 size-3.5 shrink-0" />These staged states visualize the existing MOCKED analysis lifecycle; no artificial accuracy or completion percentage is shown.</div>
        </div>
      </section>
      <p data-testid="analysis-disclaimer" className="text-center text-xs leading-5 text-slate-400">Final regulatory determination remains subject to applicable rules and verification by the appropriate authority.</p>
    </div>
  );
}