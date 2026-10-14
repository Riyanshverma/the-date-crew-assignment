import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  Filter,
  RefreshCw,
  CheckCircle2,
  HeartHandshake,
  AlertCircle
} from "lucide-react";
import type {
  CustomerRecord,
  MatchRecord,
  RankedCandidate,
  MatchingRecommendationsResponse,
  PersonProfile
} from "../../../../shared/contracts";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";
import { fetchRecommendations, createMatch, analyzeCandidateWithAI } from "@/lib/api";
import { CandidateCard } from "./CandidateCard";
import { SendMatchDialog } from "./SendMatchDialog";
import { CandidateProfileModal } from "./CandidateProfileModal";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import { Button } from "@/components/ui/button";

interface MatchingRecommendationsViewProps {
  customer: CustomerRecord;
  matches: MatchRecord[];
  matchmaker: DemoMatchmaker;
  onMatchUpdated: () => void;
}

export function MatchingRecommendationsView({
  customer,
  matches,
  matchmaker,
  onMatchUpdated
}: MatchingRecommendationsViewProps) {
  const [data, setData] = useState<MatchingRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [classificationFilter, setClassificationFilter] = useState<string>("ALL");
  const [minScore, setMinScore] = useState<number>(0);

  // Modals state
  const [candidateForProfile, setCandidateForProfile] = useState<PersonProfile | null>(null);
  const [candidateForProposal, setCandidateForProposal] = useState<RankedCandidate | null>(null);
  const [shortlistingCandidateId, setShortlistingCandidateId] = useState<string | null>(null);
  const [analyzingCandidateIds, setAnalyzingCandidateIds] = useState<Set<string>>(new Set());

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRecommendations(customer.profile.id);
      setData(res);
    } catch (err: any) {
      setError(err?.message || "Failed to load matching candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customer.profile.id]);

  // Client-side filtering on ranked candidates
  const filteredCandidates = useMemo(() => {
    if (!data?.candidates) return [];
    return data.candidates.filter((c) => {
      if (minScore > 0 && c.score < minScore) {
        return false;
      }
      if (classificationFilter !== "ALL" && !c.classifications.includes(classificationFilter as any)) {
        return false;
      }
      return true;
    });
  }, [data, classificationFilter, minScore]);

  // Handle Shortlist action
  const handleShortlist = async (candidate: RankedCandidate) => {
    setShortlistingCandidateId(candidate.candidate.id);
    try {
      await createMatch({
        customerAId: customer.profile.id,
        customerBId: candidate.candidate.id,
        createdByMatchmakerId: matchmaker.id,
        compatibilityScore: candidate.score
      });
      onMatchUpdated();
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to shortlist candidate");
    } finally {
      setShortlistingCandidateId(null);
    }
  };

  // Handle on-demand AI semantic analysis for a specific candidate
  const handleAnalyzeCandidateAI = async (candidate: RankedCandidate) => {
    const candId = candidate.candidate.id;
    setAnalyzingCandidateIds((prev) => new Set(prev).add(candId));
    try {
      const updatedCandidate = await analyzeCandidateWithAI(customer.profile.id, candId);
      setData((prev) => {
        if (!prev) return prev;
        const updatedCandidates = prev.candidates.map((c) =>
          c.candidate.id === candId ? updatedCandidate : c
        );
        // Re-sort candidates by score descending and re-assign 1-indexed ranks
        const sorted = [...updatedCandidates]
          .sort((a, b) => b.score - a.score)
          .map((c, idx) => ({ ...c, rank: idx + 1 }));
        return {
          ...prev,
          candidates: sorted
        };
      });
    } catch (err: any) {
      alert(err?.message || "Failed to analyze candidate with AI");
    } finally {
      setAnalyzingCandidateIds((prev) => {
        const next = new Set(prev);
        next.delete(candId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Strategy and Pool Overview Banner */}
      <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Deterministic Matching Engine &bull; {data?.strategy === "MALE_STRATEGY" ? "Male Customer Strategy (mvp-v1)" : "Female Customer Strategy (mvp-v1)"}
            </span>
          </div>
          <h3 className="text-base font-[650] text-ink tracking-tight">
            Curated Candidate Matches for {customer.profile.firstName} {customer.profile.lastName}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Candidates are pre-filtered through legal age, basic eligibility, and explicit dealbreaker gates, then scored deterministically across two-way preference fits.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={loadData} variant="outline" size="sm" className="h-9 text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Recalculate
          </Button>
        </div>
      </div>

      {/* Filter and Candidate Scope Bar */}
      <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span className="text-xs font-medium text-muted">Classification:</span>
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="h-8.5 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
            >
              <option value="ALL">All Eligible Matches</option>
              <option value="TWO_WAY">Two-Way Fit Only</option>
              <option value="PREFERRED">Preferred Only</option>
              <option value="REVERSE">Reverse Fit Only</option>
              <option value="BROADER">Broader Pool Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted">Min Compatibility:</span>
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="h-8.5 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
            >
              <option value={0}>Any Score</option>
              <option value={50}>50% and above</option>
              <option value={60}>60% and above</option>
              <option value={70}>70% and above (High Alignment)</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-muted">
          Showing <strong className="text-ink">{filteredCandidates.length}</strong> of{" "}
          <strong className="text-ink">{data?.totalEligible ?? 0}</strong> eligible candidates
          {data ? ` (from ${data.totalEvaluated} total opposite-gender profiles)` : ""}
        </div>
      </div>

      {/* States Handling */}
      {loading && <LoadingState message="Running deterministic two-way matching engine..." />}

      {error && <ErrorState message={error} onRetry={loadData} />}

      {!loading && !error && filteredCandidates.length === 0 && (
        <EmptyState
          title="No candidates match criteria"
          description={
            data?.totalEligible === 0
              ? "All opposite-gender candidates were excluded by strict dealbreakers or existing pairings. Try reviewing the customer's dealbreakers in Partner Preferences."
              : "Try relaxing your classification or score filters to view available candidates."
          }
        />
      )}

      {/* Candidate List Cards */}
      {!loading && !error && filteredCandidates.length > 0 && (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => {
            const existing = matches.find(
              (m) =>
                (m.customerAId === customer.profile.id && m.customerBId === candidate.candidate.id) ||
                (m.customerAId === candidate.candidate.id && m.customerBId === customer.profile.id)
            );

            return (
              <CandidateCard
                key={candidate.candidate.id}
                rankedCandidate={candidate}
                existingMatch={existing}
                onViewProfile={() => setCandidateForProfile(candidate.candidate)}
                onShortlist={() => handleShortlist(candidate)}
                onSendMatch={() => setCandidateForProposal(candidate)}
                onAnalyzeAI={() => handleAnalyzeCandidateAI(candidate)}
                analyzingAI={analyzingCandidateIds.has(candidate.candidate.id)}
                shortlisting={shortlistingCandidateId === candidate.candidate.id}
              />
            );
          })}
        </div>
      )}

      {/* Modals */}
      {candidateForProfile && (
        <CandidateProfileModal
          isOpen={Boolean(candidateForProfile)}
          onClose={() => setCandidateForProfile(null)}
          candidate={candidateForProfile}
        />
      )}

      {candidateForProposal && (
        <SendMatchDialog
          isOpen={Boolean(candidateForProposal)}
          onClose={() => setCandidateForProposal(null)}
          customer={customer.profile}
          candidate={candidateForProposal.candidate}
          compatibilityScore={candidateForProposal.score}
          matchId={
            matches.find(
              (m) =>
                (m.customerAId === customer.profile.id && m.customerBId === candidateForProposal.candidate.id) ||
                (m.customerAId === candidateForProposal.candidate.id && m.customerBId === customer.profile.id)
            )?.id
          }
          matchmaker={matchmaker}
          onSuccess={() => {
            onMatchUpdated();
            loadData();
          }}
        />
      )}
    </div>
  );
}
