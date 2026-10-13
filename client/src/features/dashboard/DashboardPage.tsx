import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  CalendarCheck2,
  Clock3
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { ProfileStatusBadge, MatchStatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DashboardPage() {
  const { matchmaker } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [readinessFilter, setReadinessFilter] = useState<string>("ALL");

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-surface rounded-[11px] border border-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-positive inline-block" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Operational Workspace
            </span>
          </div>
          <h2 className="text-xl font-[650] text-ink tracking-tight">
            Welcome back, {matchmaker?.displayName}
          </h2>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Manage your assigned relationship-ready clients, review deterministic compatibility scores,
            and facilitate thoughtful introductions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/customers">
            <Button variant="default" className="text-xs h-9">
              <Users className="w-4 h-4 mr-1.5" />
              View All Customers
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Metric Highlights (Shell / Stage preview) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Assigned Clients</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-[650] text-ink">70</div>
          <p className="text-[11px] text-muted mt-1">Under your active care</p>
        </div>

        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Active Pairings</span>
            <HeartHandshake className="w-4 h-4 text-info" />
          </div>
          <div className="text-2xl font-[650] text-ink">11</div>
          <p className="text-[11px] text-muted mt-1">Across 8 active pipeline stages</p>
        </div>

        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Proposals Shared</span>
            <Clock3 className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-[650] text-ink">4</div>
          <p className="text-[11px] text-muted mt-1">Awaiting client response</p>
        </div>

        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Introductions Arranged</span>
            <CalendarCheck2 className="w-4 h-4 text-positive" />
          </div>
          <div className="text-2xl font-[650] text-ink">3</div>
          <p className="text-[11px] text-muted mt-1">Human-curated connections</p>
        </div>
      </div>

      {/* Search & Operational Filter Bar Shell */}
      <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter clients by name, city, profession..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="text-xs font-medium text-muted shrink-0">Readiness:</span>
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className="h-9 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink focus-visible:outline-3 focus-visible:outline-primary"
          >
            <option value="ALL">All Clients</option>
            <option value="ACTIVE">Active (Ready for matching)</option>
            <option value="INCOMPLETE">Incomplete Profiles</option>
          </select>
        </div>
      </div>

      {/* Operational Queue Card Preview */}
      <div className="bg-surface rounded-[11px] border border-border overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">Assigned Client Queue</h3>
            <p className="text-xs text-muted mt-0.5">
              Individual pairings are tracked per candidate; counts derive from pairing records.
            </p>
          </div>
          <span className="text-xs bg-surface-soft text-body px-2.5 py-1 rounded-full font-medium">
            Demo Sample Records
          </span>
        </div>

        {/* Demo Cards Grid */}
        <div className="divide-y divide-border">
          {/* Example Row 1 */}
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-soft/40 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                MD
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">Meera Desai</span>
                  <span className="text-xs text-muted">&bull; 34 yrs (derived from DOB)</span>
                  <ProfileStatusBadge status="ACTIVE" />
                </div>
                <div className="text-xs text-body mt-1">
                  Indore, Madhya Pradesh &bull; Never Married &bull; Design Lead
                </div>
                {/* Pairing counts demonstration */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium text-muted">Pairing activity:</span>
                  <MatchStatusBadge status="PROPOSAL_SHARED" />
                  <MatchStatusBadge status="INTRODUCTION_ARRANGED" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Link to="/customers">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  View Profile
                </Button>
              </Link>
              <Link to="/customers">
                <Button variant="default" size="sm" className="h-8 text-xs">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Find Matches
                </Button>
              </Link>
            </div>
          </div>

          {/* Example Row 2 */}
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-soft/40 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                AS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">Ananya Sharma</span>
                  <span className="text-xs text-muted">&bull; 29 yrs (derived from DOB)</span>
                  <ProfileStatusBadge status="ACTIVE" />
                </div>
                <div className="text-xs text-body mt-1">
                  Bengaluru, Karnataka &bull; Never Married &bull; Senior Software Engineer
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium text-muted">Pairing activity:</span>
                  <MatchStatusBadge status="CLIENT_INTERESTED" />
                  <MatchStatusBadge status="BOTH_INTERESTED" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Link to="/customers">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  View Profile
                </Button>
              </Link>
              <Link to="/customers">
                <Button variant="default" size="sm" className="h-8 text-xs">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Find Matches
                </Button>
              </Link>
            </div>
          </div>

          {/* Example Row 3 (Incomplete Profile Demo) */}
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-soft/40 transition-colors">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-surface-soft text-muted font-semibold text-sm flex items-center justify-center shrink-0">
                RK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-ink">Rohan Kumar</span>
                  <span className="text-xs text-muted">&bull; 31 yrs</span>
                  <ProfileStatusBadge status="INCOMPLETE" />
                </div>
                <div className="text-xs text-body mt-1">
                  Delhi NCR &bull; Divorced &bull; Operations Manager
                </div>
                <p className="text-[11px] text-warning mt-1.5">
                  Missing partner preferences; excluded from matching candidate pool until complete.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <Link to="/customers">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-soft/30 border-t border-border text-center">
          <Link
            to="/customers"
            className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1.5"
          >
            Explore all assigned customers and profiles <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
