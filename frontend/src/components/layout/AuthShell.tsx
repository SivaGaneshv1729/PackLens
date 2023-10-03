import { ShieldCheck } from "lucide-react";

export default function AuthShell({ children, eyebrow, title, description }: { children: React.ReactNode; eyebrow: string; title: string; description: string }) {
  return (
    <div data-testid="auth-shell" className="min-h-svh bg-[#f8fafc] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <aside data-testid="auth-brand-panel" className="relative hidden overflow-hidden bg-[#111b34] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 size-96 rounded-full border border-blue-300/10 bg-blue-400/10 blur-3xl" />
        <div><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-500"><ShieldCheck className="size-6" /></span><span className="font-heading text-lg font-semibold">PackageCheck</span></div><p data-testid="auth-brand-eyebrow" className="mt-20 max-w-md text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">{eyebrow}</p><h1 data-testid="auth-brand-title" className="mt-5 max-w-xl font-heading text-5xl font-semibold leading-[1.08] tracking-tight">Make every label easier to verify.</h1><p data-testid="auth-brand-description" className="mt-6 max-w-md text-base leading-7 text-slate-300">A focused workspace for package-label review, analysis history, and clearer compliance conversations.</p></div>
        <div data-testid="auth-brand-disclaimer" className="max-w-sm border-l border-blue-400/40 pl-4 text-xs leading-5 text-slate-400">Prototype for compliance assistance only. It does not issue legally binding decisions or official certifications.</div>
      </aside>
      <main data-testid="auth-content" className="flex min-h-svh items-center justify-center px-5 py-10 sm:px-10"><div className="w-full max-w-[460px]"><div className="mb-8 flex items-center gap-3 lg:hidden"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck className="size-6" /></span><span className="font-heading text-lg font-semibold text-slate-950">PackageCheck</span></div><p data-testid="auth-eyebrow" className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">{eyebrow}</p><h2 data-testid="auth-title" className="mt-3 font-heading text-3xl font-semibold tracking-tight text-slate-950">{title}</h2><p data-testid="auth-description" className="mt-3 text-sm leading-6 text-slate-500">{description}</p><div className="mt-8">{children}</div></div></main>
    </div>
  );
}