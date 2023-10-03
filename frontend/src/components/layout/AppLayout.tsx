import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FileBarChart, FileCheck2, LayoutDashboard, LogOut, Menu, Moon, PackagePlus, Settings, ShieldCheck, Sun, X } from "lucide-react";
import { getCurrentUser, logoutUser } from "@/services/mockAuthApi";
import { toggleTheme, useTheme } from "@/lib/theme";
import GlobalSearch from "@/components/layout/GlobalSearch";
import NotificationsMenu from "@/components/layout/NotificationsMenu";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload package", icon: PackagePlus },
  { to: "/results", label: "Results", icon: FileCheck2 },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const user = getCurrentUser();
  const pageTitle = navItems.find((item) => location.pathname.startsWith(item.to))?.label ?? (location.pathname.startsWith("/analysis") ? "Analysis" : "Compliance result");

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <div data-testid="app-shell" className="min-h-svh bg-[#f8fafc] text-slate-950">
      {mobileOpen && <button data-testid="mobile-sidebar-overlay" aria-label="Close navigation" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside data-testid="app-sidebar" className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col bg-[#111b34] px-4 py-5 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <Link to="/dashboard" data-testid="sidebar-logo-link" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20"><ShieldCheck className="size-5" /></span>
            <span><span className="block font-heading text-sm font-semibold tracking-tight">PackageCheck</span><span className="block text-[10px] uppercase tracking-[0.17em] text-blue-200/70">SIH26034 prototype</span></span>
          </Link>
          <button data-testid="mobile-sidebar-close-button" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="size-5" /></button>
        </div>
        <div data-testid="sidebar-workspace-label" className="mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workspace</div>
        <nav data-testid="sidebar-navigation" className="mt-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} data-testid={`nav-${label.toLowerCase().replaceAll(" ", "-")}-link`} onClick={() => setMobileOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-900/20" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}>
              <Icon className="size-[18px]" aria-hidden="true" /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div data-testid="sidebar-disclaimer" className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-slate-400">Compliance assistance only. Final regulatory determination remains with the appropriate authority.</div>
          <button data-testid="sidebar-logout-button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-rose-500/15 hover:text-rose-200"><LogOut className="size-[18px]" />Log out</button>
        </div>
      </aside>
      <div className="lg:pl-[248px]">
        <header data-testid="app-topbar" className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button data-testid="mobile-menu-button" className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="size-5" /></button>
            <div><p data-testid="topbar-page-title" className="font-heading text-base font-semibold text-slate-950">{pageTitle}</p><p data-testid="topbar-breadcrumb" className="hidden text-xs text-slate-500 sm:block">Package Compliance Checker / {pageTitle}</p></div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch />
            <button data-testid="header-theme-toggle" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} aria-pressed={theme === "dark"} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} onClick={toggleTheme} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800">{theme === "dark" ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}</button>
            <NotificationsMenu />
            <Link to="/settings" data-testid="profile-menu-link" className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-2 transition-colors hover:bg-slate-100"><span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-700">{user?.fullName.slice(0, 1).toUpperCase() ?? "D"}</span><span className="hidden text-left sm:block"><span data-testid="profile-name" className="block max-w-28 truncate text-xs font-semibold text-slate-800">{user?.fullName ?? "Demo Reviewer"}</span><span data-testid="profile-role" className="block text-[10px] capitalize text-slate-400">{user?.accountType ?? "normal"} user</span></span></Link>
          </div>
        </header>
        <main data-testid="app-main-content" className="mx-auto max-w-[1440px] px-4 py-6 sm:px-7 lg:px-8"><Outlet /></main>
      </div>
    </div>
  );
}