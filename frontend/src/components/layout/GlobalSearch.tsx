import { useEffect, useMemo, useRef, useState } from "react";
import { FileCheck2, LayoutDashboard, PackagePlus, Search, Settings, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getResults } from "@/services/apiClient";

const pages = [
  { id: "dashboard", label: "Dashboard", description: "Overview and recent activity", path: "/dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload Package", description: "Scan a new product label", path: "/upload", icon: PackagePlus },
  { id: "results", label: "Results", description: "Browse screening history", path: "/results", icon: FileCheck2 },
  { id: "reports", label: "Reports", description: "Generate and download reports", path: "/reports", icon: FileCheck2 },
  { id: "settings", label: "Settings", description: "Account and preferences", path: "/settings", icon: Settings },
];

type SearchEntry = {
  id: string;
  label: string;
  description: string;
  path: string;
  type: "page" | "analysis";
  icon: typeof Search;
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: results = [] } = useQuery({ queryKey: ["results"], queryFn: getResults });

  const entries = useMemo<SearchEntry[]>(() => {
    const pageEntries = pages.map((page) => ({ ...page, type: "page" as const }));
    const analysisEntries = results.map((result) => ({
      id: result.analysisId,
      label: result.package.productName,
      description: `${result.package.manufacturer ?? "Manufacturer not provided"} · Analysis result`,
      path: `/results/${result.analysisId}`,
      type: "analysis" as const,
      icon: FileCheck2,
    }));
    return [...pageEntries, ...analysisEntries];
  }, [results]);

  const filteredEntries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return entries.slice(0, 8);
    return entries.filter((entry) => `${entry.label} ${entry.description}`.toLowerCase().includes(normalized)).slice(0, 8);
  }, [entries, query]);

  const focusSearchInput = () => {
    const target = window.matchMedia("(min-width: 768px)").matches ? desktopInputRef.current : mobileInputRef.current;
    target?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
        window.setTimeout(focusSearchInput, 0);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const openEntry = (entry: SearchEntry) => {
    setOpen(false);
    setQuery("");
    navigate(entry.path);
  };

  return (
    <div ref={containerRef} data-testid="topbar-search" className="relative">
      <button data-testid="mobile-search-button" type="button" aria-label="Search pages and analyses" onClick={() => { setOpen(true); window.setTimeout(focusSearchInput, 0); }} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 md:hidden"><Search className="size-[18px]" /></button>
      <div className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 md:flex lg:w-64">
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <input data-testid="global-search-input" ref={desktopInputRef} type="search" value={query} onFocus={() => setOpen(true)} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); } else if (event.key === "Enter" && filteredEntries[0]) openEntry(filteredEntries[0]); }} placeholder="Search pages or products" aria-label="Search pages, products, and manufacturers" aria-expanded={open} className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-0" />
        {query ? <button data-testid="global-search-clear-button" type="button" aria-label="Clear search" onClick={() => setQuery("")} className="rounded p-0.5 text-slate-400 hover:text-slate-700"><X className="size-3.5" /></button> : <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</kbd>}
      </div>

      {open && (
        <div data-testid="global-search-panel" className="fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.18)] md:absolute md:left-auto md:right-0 md:top-12 md:w-[390px]">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 md:hidden"><Search className="size-4 text-slate-400" /><input data-testid="global-search-mobile-input" ref={mobileInputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setOpen(false); } else if (event.key === "Enter" && filteredEntries[0]) openEntry(filteredEntries[0]); }} placeholder="Search pages, products, manufacturers" className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none" /><button data-testid="global-search-mobile-close-button" type="button" aria-label="Close search" onClick={() => setOpen(false)} className="p-1 text-slate-400"><X className="size-4" /></button></div>
          <div className="max-h-[420px] overflow-y-auto p-2">
            {filteredEntries.length ? filteredEntries.map((entry) => {
              const Icon = entry.icon;
              return <button data-testid={`global-search-result-${entry.type}-${entry.id}`} key={`${entry.type}-${entry.id}`} type="button" onClick={() => openEntry(entry)} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-50"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${entry.type === "page" ? "bg-slate-100 text-slate-600" : "bg-blue-50 text-blue-600"}`}><Icon className="size-4" /></span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800">{entry.label}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{entry.description}</span></span><ArrowHint /></button>;
            }) : <div data-testid="global-search-empty-state" className="px-4 py-8 text-center"><p className="text-sm font-semibold text-slate-700">No matches found</p><p className="mt-1 text-xs text-slate-500">Try a product, manufacturer, or page name.</p></div>}
          </div>
          <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-2 text-[10px] text-slate-400">Press Enter to open the first match · Esc to close</div>
        </div>
      )}
    </div>
  );
}

function ArrowHint() {
  return <span aria-hidden="true" className="ml-auto text-xs text-slate-300">↗</span>;
}