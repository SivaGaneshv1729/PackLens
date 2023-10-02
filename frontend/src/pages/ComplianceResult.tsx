import { TriangleAlert, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ScreeningResultView from "@/components/results/ScreeningResultView";
import { getResult } from "@/services/apiClient";

const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

export default function ComplianceResult() {
  const { analysisId = "" } = useParams();
  const navigate = useNavigate();
  
  const { data: result, isLoading } = useQuery({ 
    queryKey: ["result", analysisId], 
    queryFn: () => getResult(analysisId),
    enabled: !!analysisId
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="size-8 animate-spin text-blue-600" /></div>;

  if (!result) return <div data-testid="result-not-found" className="py-16 text-center"><TriangleAlert className="mx-auto size-10 text-amber-500" /><h1 data-testid="result-not-found-title" className="mt-4 font-heading text-2xl font-semibold">Result unavailable</h1><p data-testid="result-not-found-description" className="mt-2 text-sm text-slate-500">Unable to retrieve compliance result.</p><button data-testid="result-not-found-back-button" onClick={() => navigate("/results")} className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Back to results</button></div>;

  return <ScreeningResultView result={result} formattedDate={formatDate(result.analyzedAt)} onBack={() => navigate(-1)} onGenerateReport={() => navigate("/reports", { state: { analysisId: result.analysisId } })} onNewAnalysis={() => navigate("/upload")} onViewViolation={(violationId) => navigate(`/results/${result.analysisId}/violations/${violationId}`)} />;
}