import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Eye,
  RefreshCw
} from "lucide-react";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";
import type { CustomerSummary, MatchStatus } from "../../../../shared/contracts";
import { fetchCustomers } from "@/lib/api";
import { formatEnumText } from "@/lib/formatters";
import { ProfileStatusBadge, MatchStatusBadge } from "@/components/common/StatusBadge";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardPageProps {
  matchmaker: DemoMatchmaker;
}

export function DashboardPage({ matchmaker }: DashboardPageProps) {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [readinessFilter, setReadinessFilter] = useState<string>("ALL");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers({ matchmakerId: matchmaker.id });
      setCustomers(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [matchmaker.id]);

  // Operational metrics calculated from live data
  const metrics = useMemo(() => {
    const total = customers.length;
    const activeReady = customers.filter((c) => c.profileStatus === "ACTIVE").length;
    const incomplete = customers.filter((c) => c.profileStatus === "INCOMPLETE").length;

    // Total active pairings in queue
    let totalPairings = 0;
    for (const c of customers) {
      for (const count of Object.values(c.matchStatusCounts)) {
        if (typeof count === "number") {
          totalPairings += count;
        }
      }
    }

    return { total, activeReady, incomplete, totalPairings };
  }, [customers]);

  // Client-side search and filtering
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (readinessFilter !== "ALL" && c.profileStatus !== readinessFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
        const city = (c.city || "").toLowerCase();
        const prof = (c.profession || "").toLowerCase();
        return fullName.includes(q) || city.includes(q) || prof.includes(q);
      }
      return true;
    });
  }, [customers, readinessFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Context Banner */}
      <div className="bg-surface rounded-[11px] border border-border p-6 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-positive inline-block" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Assigned Operational Queue &bull; {matchmaker.id}
            </span>
          </div>
          <h2 className="text-xl font-[650] text-ink tracking-tight">
            Welcome back, {matchmaker.displayName}
          </h2>
          <p className="text-xs text-muted mt-1 max-w-2xl leading-relaxed">
            Manage your assigned relationship-ready clients, track individual pairing stages, and
            curate introductions.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={loadData} variant="outline" size="sm" className="h-9 text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Link to="/customers">
            <Button variant="default" size="sm" className="h-9 text-xs">
              <Users className="w-4 h-4 mr-1.5" />
              All Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Metric Highlights from Live Data */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Assigned Clients</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-[650] text-ink">{metrics.total}</div>
          <p className="text-[11px] text-muted mt-1">Under your active management</p>
        </div>

        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Active (Ready)</span>
            <CheckCircle2 className="w-4 h-4 text-positive" />
          </div>
          <div className="text-2xl font-[650] text-ink">{metrics.activeReady}</div>
          <p className="text-[11px] text-muted mt-1">Approved for matching pool</p>
        </div>

        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Incomplete Profiles</span>
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <div className="text-2xl font-[650] text-ink">{metrics.incomplete}</div>
          <p className="text-[11px] text-muted mt-1">Pending preferences or biodata</p>
        </div>

        <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-medium">Active Pairings</span>
            <HeartHandshake className="w-4 h-4 text-info" />
          </div>
          <div className="text-2xl font-[650] text-ink">{metrics.totalPairings}</div>
          <p className="text-[11px] text-muted mt-1">Pairing records in pipeline</p>
        </div>
      </div>

      {/* Search & Operational Filter Bar */}
      <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs flex items-center gap-3 justify-between">
        <div className="relative w-96">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned clients by name, city, profession..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
          <span className="text-xs font-medium text-muted shrink-0">Readiness:</span>
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className="h-9 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink focus-visible:outline-3 focus-visible:outline-primary"
          >
            <option value="ALL">All Clients ({customers.length})</option>
            <option value="ACTIVE">Active Only ({metrics.activeReady})</option>
            <option value="INCOMPLETE">Incomplete Only ({metrics.incomplete})</option>
          </select>
        </div>
      </div>

      {/* Operational Client Queue List */}
      <div className="bg-surface rounded-[11px] border border-border overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">Assigned Client Queue</h3>
            <p className="text-xs text-muted mt-0.5">
              Individual pairings are tracked per candidate; counts derive directly from pairing records.
            </p>
          </div>
          <span className="text-xs bg-surface-soft text-body px-2.5 py-1 rounded-full font-medium">
            Showing {filteredCustomers.length} clients
          </span>
        </div>

        {loading && <LoadingState message="Loading assigned clients from database..." />}

        {error && <ErrorState message={error} onRetry={loadData} />}

        {!loading && !error && filteredCustomers.length === 0 && (
          <EmptyState
            title="No matching clients found"
            description="Try adjusting your search criteria or readiness filter to view assigned clients."
          />
        )}

        {!loading && !error && filteredCustomers.length > 0 && (
          <div className="divide-y divide-border">
            {filteredCustomers.map((customer) => {
              const activeStatuses = Object.entries(customer.matchStatusCounts) as [MatchStatus, number][];

              return (
                <div
                  key={customer.id}
                  className="p-5 flex items-center justify-between gap-4 hover:bg-surface-soft/40 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                      {customer.firstName.slice(0, 1)}
                      {customer.lastName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/customers/${customer.id}`}
                          className="font-semibold text-sm text-ink hover:text-primary transition-colors"
                        >
                          {customer.firstName} {customer.lastName}
                        </Link>
                        <span className="text-xs text-muted">
                          &bull; {customer.age !== null ? `${customer.age} yrs` : "Age not specified"}
                        </span>
                        <ProfileStatusBadge status={customer.profileStatus} />
                      </div>

                      <div className="text-xs text-body mt-1">
                        {customer.city} &bull; {formatEnumText(customer.maritalStatus)} &bull;{" "}
                        {customer.profession || "Profession not specified"}
                      </div>

                      {/* Pairing activity counts */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-[11px] font-medium text-muted">Pairing activity:</span>
                        {activeStatuses.length === 0 ? (
                          <span className="text-[11px] text-muted italic">No active pairings yet</span>
                        ) : (
                          activeStatuses.map(([status, count]) => (
                            <span key={status} className="inline-flex items-center gap-1">
                              <MatchStatusBadge status={status} />
                              {count > 1 && (
                                <span className="text-[10px] font-semibold bg-surface-soft px-1 rounded-full text-muted">
                                  &times;{count}
                                </span>
                              )}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link to={`/customers/${customer.id}`}>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View Profile
                      </Button>
                    </Link>
                    <Link to={`/customers/${customer.id}?tab=matches`}>
                      <Button variant="default" size="sm" className="h-8 text-xs">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        Find Matches
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
