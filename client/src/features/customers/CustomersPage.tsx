import { useState } from "react";
import { Search, Filter, Sparkles, UserCheck, Eye } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { ProfileStatusBadge, MatchStatusBadge } from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CustomersPage() {
  const { matchmaker } = useAuth();
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-[650] text-ink tracking-tight">Customer Directory</h2>
          <p className="text-xs text-muted mt-0.5">
            Profiles assigned to {matchmaker?.displayName} ({matchmaker?.id}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium">Dataset Scope:</span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-surface rounded-full border border-border">
            140 Fictional Profiles &bull; 70 Men, 70 Women
          </span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name or city..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted shrink-0" />
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
        </div>
      </div>

      {/* Customer Cards Grid Demo Shell */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs hover:border-primary-disabled transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center">
                  MD
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-ink leading-tight">Meera Desai</h3>
                  <p className="text-xs text-muted mt-0.5">34 yrs &bull; Indore, MP</p>
                </div>
              </div>
              <ProfileStatusBadge status="ACTIVE" />
            </div>

            <div className="text-xs text-body space-y-1 mb-4 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted">Profession:</span>
                <span className="font-medium text-ink">Design Lead</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Marital Status:</span>
                <span className="font-medium text-ink">Never Married</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Education:</span>
                <span className="font-medium text-ink">Masters (Design)</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Pairings Summary
              </div>
              <div className="flex flex-wrap gap-1.5">
                <MatchStatusBadge status="PROPOSAL_SHARED" />
                <MatchStatusBadge status="INTRODUCTION_ARRANGED" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center gap-2">
            <Button variant="outline" className="flex-1 h-8 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1" />
              Profile Details
            </Button>
            <Button variant="default" className="flex-1 h-8 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Find Matches
            </Button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs hover:border-primary-disabled transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-soft text-primary font-semibold text-sm flex items-center justify-center">
                  AS
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-ink leading-tight">Ananya Sharma</h3>
                  <p className="text-xs text-muted mt-0.5">29 yrs &bull; Bengaluru, KA</p>
                </div>
              </div>
              <ProfileStatusBadge status="ACTIVE" />
            </div>

            <div className="text-xs text-body space-y-1 mb-4 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted">Profession:</span>
                <span className="font-medium text-ink">Senior Software Engineer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Marital Status:</span>
                <span className="font-medium text-ink">Never Married</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Education:</span>
                <span className="font-medium text-ink">Bachelors (B.Tech)</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-semibold text-muted mb-1.5 uppercase tracking-wider">
                Pairings Summary
              </div>
              <div className="flex flex-wrap gap-1.5">
                <MatchStatusBadge status="CLIENT_INTERESTED" />
                <MatchStatusBadge status="BOTH_INTERESTED" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center gap-2">
            <Button variant="outline" className="flex-1 h-8 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1" />
              Profile Details
            </Button>
            <Button variant="default" className="flex-1 h-8 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Find Matches
            </Button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs hover:border-primary-disabled transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-surface-soft text-muted font-semibold text-sm flex items-center justify-center">
                  RK
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-ink leading-tight">Rohan Kumar</h3>
                  <p className="text-xs text-muted mt-0.5">31 yrs &bull; Delhi NCR</p>
                </div>
              </div>
              <ProfileStatusBadge status="INCOMPLETE" />
            </div>

            <div className="text-xs text-body space-y-1 mb-4 pt-2 border-t border-border">
              <div className="flex justify-between">
                <span className="text-muted">Profession:</span>
                <span className="font-medium text-ink">Operations Manager</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Marital Status:</span>
                <span className="font-medium text-ink">Divorced</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Education:</span>
                <span className="font-medium text-ink">Bachelors</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[11px] font-semibold text-warning mb-1.5 uppercase tracking-wider">
                Incomplete Profile
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Partner preferences have not yet been recorded. Candidate is not eligible for matching.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center gap-2">
            <Button variant="outline" className="w-full h-8 text-xs">
              <Eye className="w-3.5 h-3.5 mr-1" />
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
