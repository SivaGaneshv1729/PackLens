import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import AuthShell from "@/components/layout/AuthShell";
import { registerUser } from "@/services/mockAuthApi";
import type { AccountType } from "@/types/compliance";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("normal");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) { toast.error("Use at least 8 characters for your password."); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      await registerUser({ fullName: fullName.trim(), email: email.trim(), password, accountType });
      toast.success("Account created", { description: "Use your new email to sign in." });
      navigate("/login", { replace: true, state: { email: email.trim() } });
    } catch (error) {
      toast.error("Unable to create account", { description: error instanceof Error ? error.message : "Please try again." });
    } finally { setLoading(false); }
  };

  return <AuthShell eyebrow="Create workspace" title="Start reviewing with clarity" description="Create a prototype account to save package analyses and keep your review history in one place.">
    <form data-testid="signup-form" className="space-y-4" onSubmit={submit}>
      <div><label data-testid="signup-name-label" htmlFor="signup-name" className="mb-1.5 block text-sm font-semibold text-slate-700">Full name</label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" /><input data-testid="signup-name-input" id="signup-name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="Your full name" required /></div></div>
      <div><label data-testid="signup-email-label" htmlFor="signup-email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" /><input data-testid="signup-email-input" id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="you@company.com" required /></div></div>
      <div className="grid gap-4 sm:grid-cols-2"><div><label data-testid="signup-password-label" htmlFor="signup-password" className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" /><input data-testid="signup-password-input" id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="8+ characters" required /><button data-testid="signup-password-visibility-button" type="button" aria-label="Toggle password visibility" className="absolute right-2 top-2 rounded-lg p-1.5 text-slate-400" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div><div><label data-testid="signup-confirm-label" htmlFor="signup-confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm password</label><input data-testid="signup-confirm-input" id="signup-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" placeholder="Repeat password" required /></div></div>
      <div><span data-testid="signup-account-type-label" className="mb-2 block text-sm font-semibold text-slate-700">Account type</span><div className="grid grid-cols-2 gap-2"><button data-testid="signup-normal-user-option" type="button" onClick={() => setAccountType("normal")} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${accountType === "normal" ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600"}`}>Normal User {accountType === "normal" && <Check className="size-4" />}</button><button data-testid="signup-authorized-user-option" type="button" onClick={() => setAccountType("authorized")} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${accountType === "authorized" ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 text-slate-600"}`}>Authorized User {accountType === "authorized" && <Check className="size-4" />}</button></div></div>
      <button data-testid="signup-submit-button" type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:opacity-60">{loading ? "Creating account…" : "Create account"}</button>
    </form>
    <p data-testid="signup-login-prompt" className="mt-6 flex items-center justify-center gap-1 text-sm text-slate-500"><ArrowLeft className="size-3.5" /><Link data-testid="signup-back-to-login-link" to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Back to login</Link></p>
  </AuthShell>;
}