import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  Sparkles,
  UserCheck,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { DEMO_MATCHMAKERS } from "@/features/auth/demo-credentials";
import { Button } from "@/components/ui/button";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const { matchmaker, quickLogin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/" || location.pathname === "/dashboard"
    },
    {
      label: "Customers",
      path: "/customers",
      icon: Users,
      active: location.pathname.startsWith("/customers")
    }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleSwitchMatchmaker = (id: string) => {
    quickLogin(id);
    setSwitcherOpen(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden bg-surface border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight block">The Date Crew</span>
            <span className="text-[10px] text-muted block leading-none">Matchmaker Workspace</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-2 h-9 w-9"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-scrim/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop 248px, Mobile slide-in drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-[248px] bg-surface border-r border-border flex flex-col z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group text-decoration-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs group-hover:bg-primary-hover transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm text-ink leading-tight">The Date Crew</div>
              <div className="text-[11px] text-muted leading-tight mt-0.5">Matchmaker Desk</div>
            </div>
          </Link>
          <button
            className="md:hidden text-muted hover:text-ink p-1"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[7px] text-xs font-semibold transition-colors ${
                  item.active
                    ? "bg-primary-soft text-primary"
                    : "text-body hover:bg-surface-soft hover:text-ink"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    item.active ? "text-primary" : "text-muted"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Matchmaker Profile & Switcher in Sidebar Footer */}
        <div className="p-3 border-t border-border bg-surface relative">
          {/* Switcher Popover */}
          {switcherOpen && (
            <div className="absolute bottom-[calc(100%+4px)] left-3 right-3 bg-surface rounded-[9px] border border-border shadow-lg p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-[11px] font-semibold text-muted px-2 py-1 uppercase tracking-wider">
                Switch Demo Account
              </div>
              {DEMO_MATCHMAKERS.map((mm) => (
                <button
                  key={mm.id}
                  onClick={() => handleSwitchMatchmaker(mm.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-[6px] text-xs font-medium flex items-center justify-between transition-colors ${
                    mm.id === matchmaker?.id
                      ? "bg-primary-soft text-primary font-semibold"
                      : "text-ink hover:bg-surface-soft"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{mm.displayName}</span>
                  </div>
                  {mm.id === matchmaker?.id && (
                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.2 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="rounded-[8px] bg-surface-soft p-2.5">
            <button
              onClick={() => setSwitcherOpen(!switcherOpen)}
              className="w-full text-left flex items-center justify-between group cursor-pointer"
              title="Click to switch matchmaker account"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {matchmaker?.displayName.slice(0, 1) ?? "M"}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-ink truncate group-hover:text-primary">
                    {matchmaker?.displayName ?? "Matchmaker"}
                  </div>
                  <div className="text-[11px] text-muted truncate">
                    {matchmaker?.username}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-muted shrink-0 group-hover:text-ink" />
            </button>

            <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-positive font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-positive inline-block" />
                <span>Online (Demo)</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-[11px] font-semibold text-danger hover:text-danger/80 inline-flex items-center gap-1 cursor-pointer transition-colors"
                title="Sign out of demo session"
              >
                <LogOut className="w-3 h-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header on Desktop */}
        <header className="hidden md:flex bg-surface border-b border-border px-8 py-4 items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-[650] text-ink tracking-tight">
              {title ?? "The Date Crew — Matchmaker Desk"}
            </h1>
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-ink">{matchmaker?.displayName}</div>
              <div className="text-[11px] text-muted">Assigned Matchmaker</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-semibold text-xs flex items-center justify-center">
              {matchmaker?.displayName.slice(0, 1) ?? "M"}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
