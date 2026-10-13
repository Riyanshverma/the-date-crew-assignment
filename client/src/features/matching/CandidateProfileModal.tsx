import { useState, useEffect } from "react";
import { X, User, Briefcase, Home, Heart, Sparkles, MapPin } from "lucide-react";
import type { PersonProfile } from "../../../../shared/contracts";
import { calculateAge } from "../../../../shared/contracts";
import { formatEnumText, formatAnnualIncome } from "@/lib/formatters";
import { ProfileStatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: PersonProfile;
}

export function CandidateProfileModal({
  isOpen,
  onClose,
  candidate
}: CandidateProfileModalProps) {
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

  const age = calculateAge(candidate.dateOfBirth);

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
        aria-labelledby="candidate-profile-modal-title"
        className="bg-surface rounded-[11px] border border-border shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary text-white font-bold text-base flex items-center justify-center shadow-xs">
              {candidate.firstName.slice(0, 1)}
              {candidate.lastName.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 id="candidate-profile-modal-title" className="text-base font-[650] text-ink leading-tight">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                <span className="text-xs text-muted">
                  &bull; {age !== null ? `${age} years` : "Age not specified"}
                </span>
                <ProfileStatusBadge status={candidate.profileStatus} />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {candidate.location.city}, {candidate.location.state}
                </span>
                <span>&bull;</span>
                <span>{formatEnumText(candidate.maritalStatus)}</span>
                <span>&bull;</span>
                <span className="font-mono text-[11px]">ID: {candidate.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close candidate profile modal"
            className="text-muted hover:text-ink p-1.5 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dossier Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Section: Personal & Contact */}
          <div className="bg-surface-soft/60 rounded-[9px] border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold text-ink flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-primary" /> Personal Details
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-muted block">Gender</span>
                <span className="font-medium text-ink">{candidate.gender === "MAN" ? "Man" : "Woman"}</span>
              </div>
              <div>
                <span className="text-muted block">Date of Birth / Age</span>
                <span className="font-medium text-ink">{candidate.dateOfBirth} ({age} yrs)</span>
              </div>
              <div>
                <span className="text-muted block">Height</span>
                <span className="font-medium text-ink">{candidate.heightCm ? `${candidate.heightCm} cm` : "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Languages Known</span>
                <span className="font-medium text-ink">{candidate.languagesKnown?.join(", ") || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Contact Email</span>
                <span className="font-medium text-ink font-mono text-[11px]">{candidate.contact?.email}</span>
              </div>
            </div>
          </div>

          {/* Section: Education & Career */}
          <div className="bg-surface-soft/60 rounded-[9px] border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold text-ink flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-primary" /> Education & Career
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-muted block">Highest Education</span>
                <span className="font-medium text-ink">{formatEnumText(candidate.education?.highestEducation)}</span>
              </div>
              <div>
                <span className="text-muted block">Degree / College</span>
                <span className="font-medium text-ink">
                  {candidate.education?.degree || "Not specified"} {candidate.education?.undergraduateCollege ? `(${candidate.education.undergraduateCollege})` : ""}
                </span>
              </div>
              <div>
                <span className="text-muted block">Employment Status</span>
                <span className="font-medium text-ink">{formatEnumText(candidate.career?.employmentStatus)}</span>
              </div>
              <div>
                <span className="text-muted block">Role / Designation</span>
                <span className="font-medium text-ink">
                  {candidate.career?.designation || candidate.career?.professionCategory || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Company</span>
                <span className="font-medium text-ink">{candidate.career?.company || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Annual Income</span>
                <span className="font-medium text-ink">{formatAnnualIncome(candidate.career?.annualIncome)}</span>
              </div>
            </div>
          </div>

          {/* Section: Family, Culture & Relationship */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-soft/60 rounded-[9px] border border-border p-4 space-y-3">
              <h4 className="text-xs font-semibold text-ink flex items-center gap-2">
                <Home className="w-3.5 h-3.5 text-primary" /> Family & Cultural Background
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted block">Religion</span>
                  <span className="font-medium text-ink">{candidate.culturalBackground?.religion || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-muted block">Community</span>
                  <span className="font-medium text-ink">{candidate.culturalBackground?.community || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-muted block">Family Structure</span>
                  <span className="font-medium text-ink">{formatEnumText(candidate.family?.familyStructure)}</span>
                </div>
                <div>
                  <span className="text-muted block">Siblings</span>
                  <span className="font-medium text-ink">{candidate.family?.siblings ?? "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-soft/60 rounded-[9px] border border-border p-4 space-y-3">
              <h4 className="text-xs font-semibold text-ink flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-primary" /> Relationship & Family Goals
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted block">Relationship Goal</span>
                  <span className="font-medium text-ink">{formatEnumText(candidate.relationship?.relationshipGoal)}</span>
                </div>
                <div>
                  <span className="text-muted block">Marriage Timeline</span>
                  <span className="font-medium text-ink">{candidate.relationship?.marriageTimeline || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-muted block">Children Preference</span>
                  <span className="font-medium text-ink">{formatEnumText(candidate.familyPlanning?.wantsChildren)}</span>
                </div>
                <div>
                  <span className="text-muted block">Open to Relocate</span>
                  <span className="font-medium text-ink">{formatEnumText(candidate.relocation?.openToRelocate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Lifestyle, Core Values & Hobbies */}
          <div className="bg-surface-soft/60 rounded-[9px] border border-border p-4 space-y-3">
            <h4 className="text-xs font-semibold text-ink flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Lifestyle & Declared Values
            </h4>
            <div className="grid grid-cols-4 gap-3 pb-3 border-b border-border">
              <div>
                <span className="text-muted block">Dietary Preference</span>
                <span className="font-medium text-ink">{formatEnumText(candidate.lifestyle?.dietaryPreference)}</span>
              </div>
              <div>
                <span className="text-muted block">Smoking</span>
                <span className="font-medium text-ink">{formatEnumText(candidate.lifestyle?.smoking)}</span>
              </div>
              <div>
                <span className="text-muted block">Drinking</span>
                <span className="font-medium text-ink">{formatEnumText(candidate.lifestyle?.drinking)}</span>
              </div>
              <div>
                <span className="text-muted block">Open to Pets</span>
                <span className="font-medium text-ink">{formatEnumText(candidate.lifestyle?.openToPets)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1.5">
                  Core Values
                </span>
                {candidate.relationship?.coreValues?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.relationship.coreValues.map((v) => (
                      <span key={v} className="px-2 py-0.5 rounded bg-primary-soft text-primary font-medium text-[11px]">
                        {v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted italic">None specified</span>
                )}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1.5">
                  Hobbies & Interests
                </span>
                {candidate.lifestyle?.hobbiesInterests?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.lifestyle.hobbiesInterests.map((h) => (
                      <span key={h} className="px-2 py-0.5 rounded bg-surface border border-border text-body font-medium text-[11px]">
                        {h}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted italic">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex justify-end shrink-0">
          <Button variant="outline" size="sm" onClick={onClose} className="h-8 text-xs">
            Close Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
