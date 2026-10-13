import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Sparkles, Eye, RefreshCw, Users } from "lucide-react";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";
import type { CustomerSummary, MatchStatus } from "../../../../shared/contracts";
import { fetchCustomers } from "@/lib/api";
import { formatEnumText } from "@/lib/formatters";
import { ProfileStatusBadge, MatchStatusBadge } from "@/components/common/StatusBadge";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CustomersPageProps {
  matchmaker: DemoMatchmaker;
}

export function CustomersPage({ matchmaker }: CustomersPageProps) {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [readinessFilter, setReadinessFilter] = useState("ALL");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomers({
        matchmakerId: matchmaker.id,
        gender: genderFilter !== "ALL" ? genderFilter : undefined,
        readiness: readinessFilter !== "ALL" ? readinessFilter : undefined,
        search: search.trim() || undefined
      });
      setCustomers(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [matchmaker.id, genderFilter, readinessFilter]);

  // Debounced/instant search filter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Toolbar */}
      <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs flex items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-80 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assigned clients by name, city..."
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Button type="submit" variant="outline" size="sm" className="h-9 text-xs">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3">
          {/* Gender Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted font-medium">Gender:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="h-9 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
            >
              <option value="ALL">All Genders</option>
              <option value="MAN">Men</option>
              <option value="WOMAN">Women</option>
            </select>
          </div>

          {/* Readiness Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted font-medium">Readiness:</span>
            <select
              value={readinessFilter}
              onChange={(e) => setReadinessFilter(e.target.value)}
              className="h-9 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
            >
              <option value="ALL">All Profiles</option>
              <option value="ACTIVE">Active (Ready)</option>
              <option value="INCOMPLETE">Incomplete</option>
            </select>
          </div>

          <Button onClick={loadData} variant="outline" size="sm" className="h-9 w-9 p-0" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Directory Count Bar */}
      <div className="flex items-center justify-between text-xs text-muted px-1">
        <span>
          Showing <strong className="text-ink">{customers.length}</strong> assigned clients for{" "}
          <strong className="text-ink">{matchmaker.displayName}</strong>
        </span>
      </div>

      {loading && <LoadingState message="Loading customers from directory..." />}

      {error && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && customers.length === 0 && (
        <EmptyState
          title="No customers match criteria"
          description="Try broadening your filters or clearing search terms to view customers."
        />
      )}

      {/* Customers Grid */}
      {!loading && !error && customers.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {customers.map((c) => {
            const activePairingEntries = Object.entries(c.matchStatusCounts) as [MatchStatus, number][];

            return (
              <div
                key={c.id}
                className="bg-surface rounded-[11px] border border-border p-5 shadow-xs hover:border-primary-disabled transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center shrink-0">
                        {c.firstName.slice(0, 1)}
                        {c.lastName.slice(0, 1)}
                      </div>
                      <div>
                        <Link
                          to={`/customers/${c.id}`}
                          className="font-semibold text-sm text-ink hover:text-primary transition-colors leading-tight block"
                        >
                          {c.firstName} {c.lastName}
                        </Link>
                        <p className="text-xs text-muted mt-0.5">
                          {c.age !== null ? `${c.age} yrs` : "Age not specified"} &bull; {c.city}
                        </p>
                      </div>
                    </div>
                    <ProfileStatusBadge status={c.profileStatus} />
                  </div>

                  <div className="text-xs text-body space-y-1 mb-4 pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-muted">Profession:</span>
                      <span className="font-medium text-ink truncate max-w-[160px]" title={c.profession || ""}>
                        {c.profession || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Marital Status:</span>
                      <span className="font-medium text-ink">{formatEnumText(c.maritalStatus)}</span>
                    </div>
                  </div>

                  {/* Pairings summary */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                      Pairings Activity
                    </div>
                    {activePairingEntries.length === 0 ? (
                      <p className="text-[11px] text-muted italic">No active pairings yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {activePairingEntries.map(([status, count]) => (
                          <span key={status} className="inline-flex items-center gap-1">
                            <MatchStatusBadge status={status} />
                            {count > 1 && (
                              <span className="text-[10px] font-semibold bg-surface-soft px-1 rounded-full text-muted">
                                &times;{count}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border flex items-center gap-2">
                  <Link to={`/customers/${c.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Profile
                    </Button>
                  </Link>
                  <Link to={`/customers/${c.id}?tab=matches`} className="flex-1">
                    <Button variant="default" size="sm" className="w-full h-8 text-xs">
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
  );
}
