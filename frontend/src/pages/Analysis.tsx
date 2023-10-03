import { useEffect, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AnalysisProcess, { ANALYSIS_STEPS } from "@/components/analysis/AnalysisProcess";
import { getPackage } from "@/services/mockPackageApi";
import { startPackageAnalysis } from "@/services/mockAnalysisApi";
import { readStorage } from "@/services/mockStorage";

export default function Analysis() {
  const navigate = useNavigate();
  const location = useLocation();
  const started = useRef(false);
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const packageId = (location.state as { packageId?: string } | null)?.packageId ?? readStorage("pending-package-id", "");
  const packageRecord = packageId ? getPackage(packageId) : undefined;

  useEffect(() => {
    if (!packageRecord || started.current) return;
    started.current = true;
    const timer = window.setInterval(() => setStep((current) => Math.min(current + 1, ANALYSIS_STEPS.length)), 700);
    const finish = window.setTimeout(async () => {
      window.clearInterval(timer);
      try {
        const analysisId = await startPackageAnalysis(packageRecord);
        toast.success("Analysis completed", { description: "Your compliance result is ready." });
        navigate(`/results/${analysisId}`, { replace: true });
      } catch { setFailed(true); toast.error("Analysis could not be completed", { description: "Please try again." }); }
    }, 4100);
    return () => { window.clearInterval(timer); window.clearTimeout(finish); started.current = false; };
  }, [navigate, packageId]);

  if (!packageRecord) return <div data-testid="analysis-missing-state" className="mx-auto max-w-xl py-16 text-center"><CircleAlert className="mx-auto size-10 text-amber-500" /><h1 data-testid="analysis-missing-title" className="mt-5 font-heading text-2xl font-semibold">No package is queued</h1><p data-testid="analysis-missing-description" className="mt-2 text-sm text-slate-500">Upload a package to start an analysis.</p><button data-testid="analysis-missing-upload-button" onClick={() => navigate("/upload")} className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Go to upload</button></div>;

  if (failed) return <div data-testid="analysis-failed-state" className="mx-auto max-w-xl py-16 text-center"><CircleAlert className="mx-auto size-10 text-rose-500" /><h1 data-testid="analysis-failed-title" className="mt-5 font-heading text-2xl font-semibold">Analysis failed</h1><p data-testid="analysis-failed-description" className="mt-2 text-sm text-slate-500">Analysis could not be completed. Please try again.</p><button data-testid="analysis-retry-button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Try again</button></div>;

  return <AnalysisProcess packageRecord={packageRecord} activeStep={step} />;
}