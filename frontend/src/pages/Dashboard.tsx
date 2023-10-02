import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CheckCircle2, FileCheck2, Package, TriangleAlert, UploadCloud, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MetricCard } from "@/components/common/MetricCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import TrendBars from "@/components/dashboard/TrendBars";
import { getDashboardStats, getResults } from "@/services/apiClient";
import { useTimeGreeting } from "@/hooks/useTimeGreeting";

const formatDate = (date: string) => new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));

export default function Dashboard() {
  const navigate = useNavigate();
  const greeting = useTimeGreeting();

  const { data: snapshot, isLoading: loadingStats } = useQuery({ queryKey: ["dashboard"], queryFn: getDashboardStats });
  const { data: results, isLoading: loadingResults } = useQuery({ queryKey: ["results"], queryFn: getResults });

  if (loadingStats || loadingResults) return <div className="flex h-64 items-center justify-center"><Loader2 className="size-8 animate-spin text-blue-600" /></div>;

  const recent = results?.slice(0, 4) || [];
  const stats = snapshot || { totalPackages: 0, compliantPackages: 0, nonCompliantPackages: 0, totalViolations: 0, complianceRate: 0 };
  
  // Dummy trend and categories for now as the backend doesn't compute these yet
  const violationCategories = [
    { label: "Label declarations", value: 34 },
    { label: "MRP & pricing", value: 24 },
    { label: "Quantity format", value: 18 },
    { label: "Consumer care", value: 14 },
    { label: "Other", value: 10 },
  ];

  return <div data-testid="dashboard-page" className="space-y-7">
    <section data-testid="dashboard-hero" className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p data-testid="dashboard-eyebrow" className="text-sm font-semibold text-blue-600">{greeting}, reviewer</p><h1 data-testid="dashboard-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950">Compliance at a glance</h1><p data-testid="dashboard-description" className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Keep package-label reviews moving with a single, evidence-led workspace.</p></div><button data-testid="dashboard-upload-button" onClick={() => navigate("/upload")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"><UploadCloud className="size-4" />Upload new package</button></section>
    <section data-testid="dashboard-metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Total packages checked" value={stats.totalPackages} detail="Across your workspace" icon={Package} tone="blue" /><MetricCard label="Compliant packages" value={stats.compliantPackages} detail={`${stats.complianceRate}% of reviewed packages`} icon={CheckCircle2} tone="green" /><MetricCard label="Non-compliant packages" value={stats.nonCompliantPackages} detail="Need corrective action" icon={FileCheck2} tone="rose" /><MetricCard label="Total violations" value={stats.totalViolations} detail="Across returned analyses" icon={TriangleAlert} tone="amber" /></section>
    <section className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]"><div data-testid="compliance-trend-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]"><div className="flex items-start justify-between"><div><h2 data-testid="compliance-trend-title" className="font-heading text-lg font-semibold text-slate-950">Compliance trend</h2><p data-testid="compliance-trend-description" className="mt-1 text-sm text-slate-500">Returned status over the last 12 months</p></div><span data-testid="compliance-trend-value" className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm font-semibold text-emerald-700">{stats.complianceRate}% current</span></div><TrendBars /></div><div data-testid="violation-category-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_25px_rgba(15,23,42,0.04)]"><h2 data-testid="violation-category-title" className="font-heading text-lg font-semibold text-slate-950">Violation categories</h2><p data-testid="violation-category-description" className="mt-1 text-sm text-slate-500">Most frequent areas for review</p><div className="mt-6 space-y-4">{violationCategories.map((item) => <div data-testid={`violation-category-${item.label.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`} key={item.label}><div className="mb-1.5 flex justify-between text-xs"><span className="font-medium text-slate-600">{item.label}</span><span className="font-semibold text-slate-800">{item.value}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.value}%` }} /></div></div>)}</div></div></section>
    <section data-testid="recent-analyses-section" className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_25px_rgba(15,23,42,0.04)]"><div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 data-testid="recent-analyses-title" className="font-heading text-lg font-semibold text-slate-950">Recent analyses</h2><p data-testid="recent-analyses-description" className="mt-1 text-sm text-slate-500">Your latest package review activity</p></div><button data-testid="recent-analyses-view-all-button" onClick={() => navigate("/results")} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">View all <ArrowUpRight className="size-4" /></button></div><div className="overflow-x-auto"><table data-testid="recent-analyses-table" className="w-full min-w-[760px] text-left"><thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3 font-semibold">Product name</th><th className="px-5 py-3 font-semibold">Date</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Score</th><th className="px-5 py-3 font-semibold">Violations</th><th className="px-5 py-3 font-semibold">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{recent.map((result) => <tr data-testid={`recent-analysis-row-${result.analysisId}`} key={result.analysisId} className="text-sm"><td className="px-5 py-4"><p className="font-semibold text-slate-800">{result.package.productName}</p><p className="mt-0.5 text-xs text-slate-400">{result.package.category ?? "Uncategorized"}</p></td><td className="px-5 py-4 text-slate-500">{formatDate(result.analyzedAt)}</td><td className="px-5 py-4"><StatusBadge status={result.status} testId={`recent-status-${result.analysisId}`} /></td><td className="px-5 py-4 font-semibold text-slate-800">{result.score ?? "Not provided"}%</td><td className="px-5 py-4 text-slate-500">{result.violations.length}</td><td className="px-5 py-4"><button data-testid={`recent-analysis-view-${result.analysisId}`} onClick={() => navigate(`/results/${result.analysisId}`)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50">View result</button></td></tr>)}</tbody></table></div></section>
  </div>;
}