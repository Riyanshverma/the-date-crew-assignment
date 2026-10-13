import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Sparkles, Menu, X } from "lucide-react";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";

interface AppShellProps {
  matchmaker: DemoMatchmaker;
  onLogout: () => void;
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AppShell({ matchmaker, onLogout, children, title, subtitle }: AppShellProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-canvas text-ink flex">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-scrim/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar (Responsive drawer on mobile, sticky 248px on desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[248px] shrink-0 bg-surface border-r border-border flex flex-col justify-between h-screen transition-transform duration-200 md:translate-x-0 md:static md:sticky md:top-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-5.25 border-b border-border flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink leading-tight">The Date Crew</div>
                <div className="text-[11px] text-muted leading-tight mt-0.5">Matchmaker Desk</div>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="text-muted hover:text-ink p-1 md:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold text-muted uppercase tracking-wider">
              Workspace
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
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
        </div>

        {/* Sidebar Footer: Simple Sign Out Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[7px] text-xs font-semibold text-danger hover:bg-danger-soft transition-colors cursor-pointer border border-border"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-surface border-b border-border px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1.5 rounded-[7px] border border-border text-muted hover:text-ink hover:bg-surface-soft md:hidden cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-[650] text-ink tracking-tight">
                {title ?? "Matchmaker Dashboard"}
              </h1>
              {subtitle && <p className="text-[11px] sm:text-xs text-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-ink">{matchmaker.displayName}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-soft text-primary font-semibold text-xs flex items-center justify-center shadow-xs">
              {matchmaker.displayName.slice(0, 1)}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
