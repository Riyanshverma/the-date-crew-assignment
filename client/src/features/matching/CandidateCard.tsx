import { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Star,
  Send,
  ChevronDown,
  ChevronUp,
  MapPin,
  Briefcase
} from "lucide-react";
import type {
  RankedCandidate,
  PreferenceEvidence,
  MatchRecord
} from "../../../../shared/contracts";
import { calculateAge } from "../../../../shared/contracts";
import { formatEnumText, formatAnnualIncome } from "@/lib/formatters";
import { MatchClassificationBadge, MatchStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

interface CandidateCardProps {
  rankedCandidate: RankedCandidate;
  existingMatch?: MatchRecord;
  onViewProfile: () => void;
  onShortlist: () => void;
  onSendMatch: () => void;
  shortlisting?: boolean;
}

type EvidenceTab = "matched" | "differences" | "unknowns";

export function CandidateCard({
  rankedCandidate,
  existingMatch,
  onViewProfile,
  onShortlist,
  onSendMatch,
  shortlisting
}: CandidateCardProps) {
  const [evidenceTab, setEvidenceTab] = useState<EvidenceTab>("matched");
  const [expanded, setExpanded] = useState(true);

  const {
    candidate,
    rank,
    score,
    scoreCoverage,
    customerPreferenceFit,
    reversePreferenceFit,
    classifications,
    matchedPreferences,
    differences,
    unknowns
  } = rankedCandidate;

  const age = calculateAge(candidate.dateOfBirth);

  return (
    <div className="bg-surface rounded-[11px] border border-border overflow-hidden shadow-xs hover:border-primary-disabled transition-all">
      {/* Top Banner: Rank, Basics & Compatibility Score */}
      <div className="p-5 flex items-start justify-between gap-5 border-b border-border/80">
        <div className="flex items-start gap-4">
          {/* Rank Badge & Avatar */}
          <div className="relative">
            <div className="w-13 h-13 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {candidate.firstName.slice(0, 1)}
              {candidate.lastName.slice(0, 1)}
            </div>
            <span className="absolute -bottom-2 -right-1 px-1.5 py-0.5 rounded-full bg-ink text-white font-bold text-[10px] shadow-xs">
              #{rank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-[650] text-ink leading-tight">
                {candidate.firstName} {candidate.lastName}
              </h3>
              <span className="text-xs text-muted">
                &bull; {age !== null ? `${age} yrs` : "Age not specified"}
              </span>
              <span className="text-xs text-muted">
                &bull; {formatEnumText(candidate.maritalStatus)}
              </span>
            </div>

            <div className="text-xs text-body mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted" />
                {candidate.location.city}, {candidate.location.state}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-muted" />
                {candidate.career.designation || candidate.career.professionCategory || "Professional"}
              </span>
              <span>&bull;</span>
              <span>{formatAnnualIncome(candidate.career.annualIncome)}</span>
            </div>

            {/* Classification Badges */}
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              {classifications.map((cl) => (
                <MatchClassificationBadge key={cl} classification={cl} />
              ))}
              {existingMatch && (
                <span className="inline-flex items-center gap-1 ml-1">
                  <span className="text-[11px] text-muted font-medium">Stage:</span>
                  <MatchStatusBadge status={existingMatch.status} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Compatibility Score Widget */}
        <div className="text-right shrink-0 bg-primary-soft/40 p-3 rounded-[9px] border border-primary/10">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-[700] text-primary">{score}%</span>
            <span className="text-[11px] font-semibold text-primary/80 uppercase tracking-wider">
              Score
            </span>
          </div>
          <div className="text-[10px] text-muted font-medium mt-0.5">
            {scoreCoverage}% Score Coverage
          </div>
          <div className="text-[11px] text-body mt-1 pt-1 border-t border-primary/10">
            Customer Fit: <strong>{customerPreferenceFit}%</strong> &bull; Reverse:{" "}
            <strong>{reversePreferenceFit}%</strong>
          </div>
        </div>
      </div>

      {/* Comparison Evidence Section */}
      <div className="p-5 bg-surface-soft/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink">Structured Comparison Evidence</span>
            <span className="text-[11px] text-muted italic">
              &bull; Based on structured preference alignment; not a prediction of relationship success.
            </span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted hover:text-ink flex items-center gap-1 cursor-pointer"
          >
            {expanded ? "Collapse Evidence" : "Expand Evidence"}
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="space-y-3">
            {/* Evidence Category Toggle Buttons */}
            <div className="flex items-center gap-1.5 bg-surface p-1 rounded-[7px] border border-border w-fit text-xs">
              <button
                onClick={() => setEvidenceTab("matched")}
                className={`px-3 py-1 rounded-[5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  evidenceTab === "matched"
                    ? "bg-positive-soft text-positive shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matched Criteria ({matchedPreferences.length})
              </button>

              <button
                onClick={() => setEvidenceTab("differences")}
                className={`px-3 py-1 rounded-[5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  evidenceTab === "differences"
                    ? "bg-warning-soft text-warning shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Differences ({differences.length})
              </button>

              <button
                onClick={() => setEvidenceTab("unknowns")}
                className={`px-3 py-1 rounded-[5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  evidenceTab === "unknowns"
                    ? "bg-surface-soft text-body shadow-xs"
                    : "text-muted hover:text-ink"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Unknown Fields ({unknowns.length})
              </button>
            </div>

            {/* Evidence Items List */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {evidenceTab === "matched" &&
                (matchedPreferences.length === 0 ? (
                  <p className="text-muted italic col-span-2 py-2">No matching criteria recorded.</p>
                ) : (
                  matchedPreferences.map((ev, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-[7px] bg-positive-soft/50 border border-positive/15 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-positive flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 shrink-0" />
                          {ev.label}
                        </span>
                        {ev.result === "PARTIAL_MATCH" && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-surface text-warning border border-border">
                            Partial Fit
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-body">{ev.explanation}</p>
                    </div>
                  ))
                ))}

              {evidenceTab === "differences" &&
                (differences.length === 0 ? (
                  <p className="text-muted italic col-span-2 py-2">
                    No preference differences detected. Candidate aligns with all criteria.
                  </p>
                ) : (
                  differences.map((ev, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-[7px] bg-warning-soft/50 border border-warning/15 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-warning flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {ev.label}
                        </span>
                        {ev.importance && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-surface text-muted border border-border">
                            {ev.importance}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-body">{ev.explanation}</p>
                    </div>
                  ))
                ))}

              {evidenceTab === "unknowns" &&
                (unknowns.length === 0 ? (
                  <p className="text-muted italic col-span-2 py-2">
                    All comparison fields have complete data recorded.
                  </p>
                ) : (
                  unknowns.map((ev, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-[7px] bg-surface border border-border space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-muted flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 shrink-0" />
                          {ev.label}
                        </span>
                        <span className="text-[10px] text-muted italic">Unknown</span>
                      </div>
                      <p className="text-[11px] text-muted">{ev.explanation}</p>
                    </div>
                  ))
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 bg-surface border-t border-border flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewProfile}
          className="h-8.5 text-xs"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          View Profile
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShortlist}
            disabled={shortlisting || existingMatch?.status === "SHORTLISTED"}
            className="h-8.5 text-xs text-ink"
          >
            <Star className="w-3.5 h-3.5 mr-1.5 text-warning" />
            {existingMatch?.status === "SHORTLISTED" ? "Shortlisted" : "Shortlist Candidate"}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={onSendMatch}
            className="h-8.5 text-xs px-3.5"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Match
          </Button>
        </div>
      </div>
    </div>
  );
}
