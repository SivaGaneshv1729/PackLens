import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/layout/AuthShell";
import { loginUser } from "@/services/mockAuthApi";
import type { AccountType } from "@/types/compliance";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = (location.state as { email?: string } | null)?.email ?? "";
  const [accountType, setAccountType] = useState<AccountType>("normal");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password, accountType);
      toast.success("Welcome back", { description: "Your compliance workspace is ready." });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("Unable to sign in", { description: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell eyebrow="Secure workspace" title="Welcome back" description="Sign in to review package labels, follow analyses, and prepare clearer compliance reports.">
    <div data-testid="login-mode-tabs" className="grid grid-cols-2 rounded-xl bg-slate-100 p-1"><button data-testid="login-normal-user-tab" type="button" className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${accountType === "normal" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`} onClick={() => setAccountType("normal")}>Normal User</button><button data-testid="login-authorized-user-tab" type="button" className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${accountType === "authorized" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`} onClick={() => setAccountType("authorized")}>Authorized User</button></div>
    <form data-testid="login-form" className="mt-6 space-y-5" onSubmit={submit}>
      <div><label data-testid="login-email-label" htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">{accountType === "authorized" ? "Email / User ID" : "Email address"}</label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" /><input data-testid="login-email-input" id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition-shadow placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required /></div></div>
      <div><div className="mb-2 flex items-center justify-between"><label data-testid="login-password-label" htmlFor="login-password" className="block text-sm font-semibold text-slate-700">Password</label><button data-testid="forgot-password-button" type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700" onClick={() => toast.info("Password recovery will be connected to the backend authentication service.")}>Forgot password?</button></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" /><input data-testid="login-password-input" id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-11 text-sm outline-none transition-shadow placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" required /><button data-testid="login-password-visibility-button" type="button" aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
      <button data-testid="login-submit-button" type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:opacity-60">{loading && <Loader2 className="size-4 animate-spin" />}{loading ? "Signing in…" : "Sign in"}</button>
    </form>
    <div data-testid="login-demo-hint" className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs leading-5 text-blue-800"><span className="font-semibold">Demo access:</span> demo@packagecheck.local / Demo123!</div>
    <p data-testid="login-signup-prompt" className="mt-7 text-center text-sm text-slate-500">New to PackageCheck? <Link data-testid="login-create-account-link" to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">Create an account</Link></p>
    <p data-testid="login-security-note" className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="size-3.5" /> Your prototype account stays in this browser</p>
  </AuthShell>;
}