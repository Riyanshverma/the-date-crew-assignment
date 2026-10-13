import { useState, type FormEvent } from "react";
import { Sparkles, ShieldAlert, KeyRound } from "lucide-react";
import { DEMO_MATCHMAKERS, type DemoMatchmaker } from "./demo-credentials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginPageProps {
  onLogin: (matchmaker: DemoMatchmaker) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("demo-matchmaker-1");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const found = DEMO_MATCHMAKERS.find(
      (mm) => mm.username.toLowerCase() === username.trim().toLowerCase() && mm.password === password
    );

    if (found) {
      onLogin(found);
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white shadow-sm mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-[650] text-ink tracking-tight">The Date Crew</h1>
          <p className="text-xs text-muted mt-1">Matchmaker Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-[11px] border border-border p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-ink mb-1">Sign In</h2>
          <p className="text-xs text-muted mb-4">Enter matchmaker credentials to continue</p>

          {error && (
            <div
              role="alert"
              className="mb-4 p-2.5 rounded-[7px] bg-danger-soft border border-danger/20 text-danger text-xs flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-ink mb-1">
                Username
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. demo-matchmaker-1"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-ink mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            <Button type="submit" className="w-full mt-2 text-xs">
              <KeyRound className="w-3.5 h-3.5 mr-1.5" />
              Sign In
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-border text-[11px] text-muted text-center">
            Demo login: <span className="font-mono text-ink">demo-matchmaker-1</span> / <span className="font-mono text-ink">password123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
