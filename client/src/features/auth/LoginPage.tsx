import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ShieldAlert, Sparkles, UserCheck } from "lucide-react";
import { useAuth } from "./AuthContext";
import { DEMO_MATCHMAKERS } from "./demo-credentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  const { login, quickLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("demo-matchmaker-1");
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setErrorMessage(result.error ?? "Authentication failed");
    }
  };

  const handleQuickLogin = (id: string) => {
    setErrorMessage(null);
    if (quickLogin(id)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-white shadow-sm mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-[28px] font-[650] text-ink tracking-tight">The Date Crew</h1>
          <p className="text-sm text-body mt-1">Matchmaker Portal &bull; Curated Introductions</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-xs font-semibold">
            <span>Demo Gateway</span>
            <span className="text-muted-soft">&bull;</span>
            <span>Frontend-Only Gate</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-surface rounded-[11px] border border-border p-7 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-ink">Sign In to Workspace</h2>
            <p className="text-xs text-muted mt-0.5">
              Access customer profiles, matchmaking algorithms, and assigned pairings.
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-[7px] bg-danger-soft border border-danger/20 text-danger text-xs flex items-start gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-ink mb-1.5">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. demo-matchmaker-1"
                className="bg-surface"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-ink">
                  Password
                </label>
                <span className="text-[11px] text-muted">demo: password123</span>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="bg-surface"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-white h-10 mt-2 font-semibold text-[13px] rounded-[7px] transition-colors"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Sign In to Workspace
            </Button>
          </form>

          {/* Quick Login Helper */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2.5">
              Quick One-Click Demo Access
            </p>
            <div className="space-y-2">
              {DEMO_MATCHMAKERS.map((mm) => (
                <button
                  key={mm.id}
                  type="button"
                  onClick={() => handleQuickLogin(mm.id)}
                  className="w-full text-left p-2.5 rounded-[7px] border border-border hover:border-primary-disabled hover:bg-surface-soft transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary-soft text-primary font-semibold text-xs flex items-center justify-center shrink-0">
                      {mm.displayName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-ink group-hover:text-primary">
                        {mm.displayName}
                      </div>
                      <div className="text-[11px] text-muted font-mono">{mm.username}</div>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-muted group-hover:text-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Security / Privacy notice */}
        <p className="text-center text-[11px] text-muted mt-6 px-4 leading-relaxed">
          This demo uses a frontend-only gate with synthetic test profiles. Real authentication is
          not implemented for this local evaluation.
        </p>
      </div>
    </div>
  );
}
