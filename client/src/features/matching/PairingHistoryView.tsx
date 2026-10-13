import { useState } from "react";
import {
  Clock,
  MessageSquare,
  ArrowRight,
  Send,
  Calendar,
  AlertCircle,
  CheckCircle2,
  PlusCircle
} from "lucide-react";
import type {
  MatchRecord,
  CustomerRecord,
  MatchStatus
} from "../../../../shared/contracts";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";
import { updateMatchStatus, addMatchNote, updateMatchFollowUp } from "@/lib/api";
import { formatDate } from "@/lib/formatters";
import { MatchStatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/FeedbackStates";
import { Button } from "@/components/ui/button";

interface PairingHistoryViewProps {
  matches: MatchRecord[];
  customer: CustomerRecord;
  matchmaker: DemoMatchmaker;
  onMatchUpdated: () => void;
}

const ALL_MATCH_STATUSES: MatchStatus[] = [
  "SHORTLISTED",
  "PROPOSAL_SHARED",
  "CLIENT_INTERESTED",
  "AWAITING_OTHER_PERSON",
  "BOTH_INTERESTED",
  "INTRODUCTION_ARRANGED",
  "AWAITING_FEEDBACK",
  "IN_PROGRESS",
  "DECLINED",
  "ON_HOLD",
  "CLOSED"
];

export function PairingHistoryView({
  matches,
  customer,
  matchmaker,
  onMatchUpdated
}: PairingHistoryViewProps) {
  // State for active inline forms
  const [editingStatusMatchId, setEditingStatusMatchId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<MatchStatus>("CLIENT_INTERESTED");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Pairing note state
  const [addingNoteMatchId, setAddingNoteMatchId] = useState<string | null>(null);
  const [pairingNoteBody, setPairingNoteBody] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  // Follow-up state
  const [editingFollowUpMatchId, setEditingFollowUpMatchId] = useState<string | null>(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [savingFollowUp, setSavingFollowUp] = useState(false);

  const handleUpdateStatus = async (matchId: string) => {
    setUpdatingStatus(true);
    setStatusError(null);
    try {
      await updateMatchStatus(matchId, {
        toStatus: targetStatus,
        changedByMatchmakerId: matchmaker.id,
        note: statusNote.trim() || undefined
      });
      setEditingStatusMatchId(null);
      setStatusNote("");
      onMatchUpdated();
    } catch (err: any) {
      setStatusError(err?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = async (matchId: string) => {
    if (!pairingNoteBody.trim()) return;
    setSavingNote(true);
    try {
      await addMatchNote(matchId, {
        authorMatchmakerId: matchmaker.id,
        body: pairingNoteBody.trim()
      });
      setAddingNoteMatchId(null);
      setPairingNoteBody("");
      onMatchUpdated();
    } catch (err: any) {
      alert(err?.message || "Failed to add pairing note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleSaveFollowUp = async (matchId: string) => {
    setSavingFollowUp(true);
    try {
      const iso = followUpDate ? new Date(followUpDate).toISOString() : null;
      await updateMatchFollowUp(matchId, iso);
      setEditingFollowUpMatchId(null);
      setFollowUpDate("");
      onMatchUpdated();
    } catch (err: any) {
      alert(err?.message || "Failed to save follow-up date");
    } finally {
      setSavingFollowUp(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ink">Active Pairings & Pipeline History</h3>
          <p className="text-xs text-muted mt-0.5">
            Individual candidate relationships are tracked independently; status transitions and notes persist per pairing.
          </p>
        </div>
        <span className="text-xs font-medium text-muted bg-surface-soft px-2.5 py-1 rounded-full">
          {matches.length} recorded pairings
        </span>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          title="No pairings created yet"
          description="Use the 'Candidate Matches' tab to review scored recommendations, shortlist candidates, or share mock proposals."
        />
      ) : (
        <div className="space-y-4">
          {matches.map((m) => {
            const partnerId =
              m.customerAId === customer.profile.id ? m.customerBId : m.customerAId;

            return (
              <div
                key={m.id}
                className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-semibold text-ink">
                        Candidate Pairing: <span className="font-mono text-primary">{partnerId}</span>
                      </span>
                      <MatchStatusBadge status={m.status} />
                      <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-md">
                        {m.compatibilityScore}% Compatibility
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      Created on {formatDate(m.createdAt)} by matchmaker {m.createdByMatchmakerId}
                    </p>
                  </div>

                  {/* Follow up widget */}
                  <div className="text-right text-xs">
                    <span className="text-muted block">Follow-Up Schedule:</span>
                    {m.followUpAt ? (
                      <span className="font-medium text-warning flex items-center gap-1 justify-end mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> {formatDate(m.followUpAt)}
                      </span>
                    ) : (
                      <span className="text-muted italic block mt-0.5">No date scheduled</span>
                    )}
                  </div>
                </div>

                {/* Mock Proposal Details */}
                {m.proposal?.sharedAt && (
                  <div className="p-3.5 rounded-[9px] bg-primary-soft/50 border border-primary/15 text-xs space-y-1">
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mock Proposal Shared on {formatDate(m.proposal.sharedAt)} by {m.proposal.sharedByMatchmakerId}
                    </span>
                    <p className="text-body italic">"{m.proposal.mockMessage}"</p>
                  </div>
                )}

                {/* Controls Action Toolbar */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingStatusMatchId(m.id);
                        setTargetStatus(m.status);
                        setStatusError(null);
                      }}
                      className="h-8 text-xs"
                    >
                      <ArrowRight className="w-3.5 h-3.5 mr-1" />
                      Update Status
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingFollowUpMatchId(m.id)}
                      className="h-8 text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      Schedule Follow-up
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingNoteMatchId(m.id)}
                      className="h-8 text-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5 mr-1" />
                      Add Pairing Note
                    </Button>
                  </div>
                </div>

                {/* Inline Status Update Form */}
                {editingStatusMatchId === m.id && (
                  <div className="p-4 bg-surface-soft rounded-[9px] border border-border space-y-3">
                    <div className="text-xs font-semibold text-ink">Update Pairing Stage</div>
                    {statusError && (
                      <div className="p-2 rounded bg-danger-soft text-danger text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{statusError}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-muted block mb-1">Select New Status:</label>
                        <select
                          value={targetStatus}
                          onChange={(e) => setTargetStatus(e.target.value as MatchStatus)}
                          className="w-full h-8.5 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
                        >
                          {ALL_MATCH_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-muted block mb-1">Transition Note (Optional):</label>
                        <input
                          type="text"
                          value={statusNote}
                          onChange={(e) => setStatusNote(e.target.value)}
                          placeholder="e.g. Client requested introduction call"
                          className="w-full h-8.5 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingStatusMatchId(null)}
                        className="h-7.5 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={updatingStatus}
                        onClick={() => handleUpdateStatus(m.id)}
                        className="h-7.5 text-xs"
                      >
                        Save Stage
                      </Button>
                    </div>
                  </div>
                )}

                {/* Inline Follow-up Scheduler Form */}
                {editingFollowUpMatchId === m.id && (
                  <div className="p-4 bg-surface-soft rounded-[9px] border border-border space-y-3">
                    <div className="text-xs font-semibold text-ink">Set Follow-Up Date</div>
                    <div className="flex items-center gap-3">
                      <input
                        type="date"
                        value={followUpDate}
                        onChange={(e) => setFollowUpDate(e.target.value)}
                        className="h-8.5 rounded-[7px] border border-border-strong bg-surface px-2.5 text-xs text-ink"
                      />
                      <Button
                        size="sm"
                        disabled={savingFollowUp}
                        onClick={() => handleSaveFollowUp(m.id)}
                        className="h-8.5 text-xs"
                      >
                        Save Date
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFollowUpMatchId(null)}
                        className="h-8.5 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Inline Add Pairing Note Form */}
                {addingNoteMatchId === m.id && (
                  <div className="p-4 bg-surface-soft rounded-[9px] border border-border space-y-3">
                    <div className="text-xs font-semibold text-ink">Add Note for this Pairing</div>
                    <textarea
                      rows={2}
                      value={pairingNoteBody}
                      onChange={(e) => setPairingNoteBody(e.target.value)}
                      placeholder="Record feedback, interaction summary, or client hesitation..."
                      className="w-full rounded-[7px] border border-border-strong bg-surface p-2.5 text-xs text-ink"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAddingNoteMatchId(null)}
                        className="h-7.5 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={savingNote}
                        onClick={() => handleAddNote(m.id)}
                        className="h-7.5 text-xs"
                      >
                        Save Note
                      </Button>
                    </div>
                  </div>
                )}

                {/* Pairing Notes List */}
                {m.notes?.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                      Pairing Notes ({m.notes.length})
                    </span>
                    <div className="space-y-1.5">
                      {m.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-[7px] bg-surface-soft text-xs text-body"
                        >
                          <div className="flex justify-between text-[11px] text-muted mb-0.5">
                            <span className="font-semibold text-ink font-mono">{note.authorMatchmakerId}</span>
                            <span>{formatDate(note.createdAt)}</span>
                          </div>
                          <p className="whitespace-pre-wrap">{note.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status History Events Timeline */}
                {m.statusHistory?.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                      Pipeline Event History
                    </span>
                    <div className="space-y-2">
                      {m.statusHistory.map((ev) => (
                        <div key={ev.id} className="text-xs flex items-start gap-2 text-body">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-ink">
                              {ev.fromStatus ? `${ev.fromStatus} → ` : ""}
                              {ev.toStatus}
                            </span>
                            <span className="text-muted text-[11px] ml-2">
                              ({formatDate(ev.createdAt)} by {ev.changedByMatchmakerId})
                            </span>
                            {ev.note && <p className="text-muted text-[11px] mt-0.5">{ev.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
