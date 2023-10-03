import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div data-testid="empty-state" className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <span className="rounded-2xl bg-slate-100 p-3 text-slate-500"><Icon className="size-6" aria-hidden="true" /></span>
      <h3 data-testid="empty-state-title" className="mt-4 font-heading text-lg font-semibold text-slate-900">{title}</h3>
      <p data-testid="empty-state-description" className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}