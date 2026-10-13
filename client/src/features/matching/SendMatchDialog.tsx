import { useState, useEffect } from "react";
import { Sparkles, Send, AlertCircle, X, ShieldAlert } from "lucide-react";
import type { PersonProfile } from "../../../../shared/contracts";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";
import { createMatch, shareMatchProposal } from "@/lib/api";
import { calculateAge } from "../../../../shared/contracts";
import { Button } from "@/components/ui/button";

interface SendMatchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: PersonProfile;
  candidate: PersonProfile;
  compatibilityScore: number;
  matchId?: string;
  matchmaker: DemoMatchmaker;
  onSuccess: () => void;
}

export function SendMatchDialog({
  isOpen,
  onClose,
  customer,
  candidate,
  compatibilityScore,
  matchId,
  matchmaker,
  onSuccess
}: SendMatchDialogProps) {
  const [mockMessage, setMockMessage] = useState(
    "Demo-only proposal: please review this profile and share whether you would like an introduction."
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const candidateAge = calculateAge(candidate.dateOfBirth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let targetMatchId = matchId;

      // If pairing does not exist yet, create it first
      if (!targetMatchId) {
        const created = await createMatch({
          customerAId: customer.id,
          customerBId: candidate.id,
          createdByMatchmakerId: matchmaker.id,
          compatibilityScore
        });
        targetMatchId = created.id;
      }

      // Record proposal sharing
      await shareMatchProposal(targetMatchId, matchmaker.id, mockMessage);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to share match proposal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-match-dialog-title"
        className="bg-surface rounded-[11px] border border-border shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 id="send-match-dialog-title" className="text-sm font-[650] text-ink leading-tight">
                Send Match Proposal
              </h3>
              <p className="text-[11px] text-muted leading-tight mt-0.5">
                Prepare proposal for client review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close send match dialog"
            className="text-muted hover:text-ink p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-[7px] bg-danger-soft text-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Candidate Context Pill */}
          <div className="bg-surface-soft p-3.5 rounded-[9px] border border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center">
                {candidate.firstName.slice(0, 1)}
                {candidate.lastName.slice(0, 1)}
              </div>
              <div>
                <div className="text-xs font-semibold text-ink">
                  {candidate.firstName} {candidate.lastName}
                </div>
                <div className="text-[11px] text-muted">
                  {candidateAge !== null ? `${candidateAge} yrs` : "Age not specified"} &bull; {candidate.location.city} &bull; {candidate.career.designation || candidate.career.professionCategory || "Professional"}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                {compatibilityScore}% Fit
              </span>
            </div>
          </div>

          {/* Mandatory Demo Safeguard Notice per ARCHITECTURE.md */}
          <div className="p-3 rounded-[7px] bg-warning-soft text-warning text-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Mock Proposal Notice (MVP Constraint)
            </div>
            <p className="text-[11px] leading-relaxed text-warning/90">
              This action records status <strong>PROPOSAL_SHARED</strong> and stores a mock message for customer review. No real email is dispatched and mutual consent is not inferred.
            </p>
          </div>

          {/* Message field */}
          <div className="space-y-1.5">
            <label htmlFor="send-match-message" className="text-xs font-semibold text-ink block">
              Matchmaker Review Note / Introduction Pitch
            </label>
            <textarea
              id="send-match-message"
              rows={3}
              required
              value={mockMessage}
              onChange={(e) => setMockMessage(e.target.value)}
              placeholder="Add introduction notes or personal pitch for client..."
              className="w-full rounded-[7px] border border-border-strong bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus-visible:outline-3 focus-visible:outline-primary"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={submitting}
              className="h-9 text-xs px-4"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              {submitting ? "Recording Proposal..." : "Confirm & Record Proposal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
