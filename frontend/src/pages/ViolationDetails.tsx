import { ArrowLeft, CheckCircle2, MapPin, TriangleAlert, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { StatusBadge } from "@/components/common/StatusBadge";
import { getResult } from "@/services/apiClient";

export default function ViolationDetails() {
  const { analysisId = "", violationId = "" } = useParams();
  const navigate = useNavigate();
  
  const { data: result, isLoading } = useQuery({ 
    queryKey: ["result", analysisId], 
    queryFn: () => getResult(analysisId),
    enabled: !!analysisId
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="size-8 animate-spin text-blue-600" /></div>;

  const violation = result?.violations.find((item) => item.id === violationId);
  if (!result || !violation) return <div data-testid="violation-not-found" className="py-16 text-center"><TriangleAlert className="mx-auto size-10 text-amber-500" /><h1 data-testid="violation-not-found-title" className="mt-4 font-heading text-2xl font-semibold">Violation unavailable</h1><button data-testid="violation-not-found-back-button" onClick={() => navigate(`/results/${analysisId}`)} className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Back to result</button></div>;
  return <div data-testid="violation-details-page" className="mx-auto max-w-5xl space-y-7"><div><button data-testid="violation-back-button" onClick={() => navigate(`/results/${analysisId}`)} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="size-4" />Back to result</button><p data-testid="violation-eyebrow" className="text-sm font-semibold text-blue-600">Evidence detail</p><h1 data-testid="violation-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950">{violation.title}</h1><p data-testid="violation-product-context" className="mt-2 text-sm text-slate-500">{result.package.productName} · {result.package.fileName}</p></div><div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><section data-testid="violation-evidence-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]"><div className="relative overflow-hidden rounded-xl bg-slate-100"><img data-testid="violation-package-image" src={result.package.imageUrl} alt={`${result.package.productName} package evidence`} className="max-h-[520px] min-h-80 w-full object-cover" />{violation.location && <div data-testid="violation-image-highlight" className="absolute border-2 border-rose-500 bg-rose-500/15 shadow-[0_0_0_9999px_rgba(15,23,42,0.1)]" style={{ left: `${violation.location.x}%`, top: `${violation.location.y}%`, width: `${violation.location.width}%`, height: `${violation.location.height}%` }}><span className="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white">Returned location</span></div>}</div><div className="mt-4 flex items-center gap-2 text-sm text-slate-500">{violation.location ? <><MapPin className="size-4 text-rose-500" /> Location highlight returned by analysis</> : <><CheckCircle2 className="size-4 text-slate-400" /> No image coordinates returned for this item</>}</div></section><section data-testid="violation-information-card" className="space-y-4"><div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-5"><div className="flex items-start justify-between gap-4"><div><p data-testid="violation-section-label" className="text-xs font-semibold uppercase tracking-wider text-rose-700/70">Violation</p><h2 data-testid="violation-section-title" className="mt-2 font-heading text-xl font-semibold text-slate-950">{violation.title}</h2></div><StatusBadge status={violation.severity} testId="violation-severity-badge" /></div></div><InfoBlock label="Detected information" value={violation.detectedInformation} testId="violation-detected-information" /><InfoBlock label="Required information" value={violation.requiredInformation} testId="violation-required-information" /><InfoBlock label="Recommendation" value={violation.recommendation} testId="violation-recommendation" /></section></div><p data-testid="violation-disclaimer" className="text-center text-xs leading-5 text-slate-400">Only information returned by the analysis is shown here. No legal conclusion is generated in the frontend.</p></div>;
}

function InfoBlock({ label, value, testId }: { label: string; value?: string; testId: string }) {
  return <div data-testid={`${testId}-block`} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p data-testid={testId} className="mt-2 text-sm leading-6 text-slate-700">{value ?? "Not provided"}</p></div>;
}