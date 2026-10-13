import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  User,
  Heart,
  History,
  FileText,
  Send,
  Calendar,
  Briefcase,
  GraduationCap,
  MapPin,
  Home,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import type { DemoMatchmaker } from "@/features/auth/demo-credentials";
import type { CustomerRecord, MatchRecord, CustomerNote } from "../../../../shared/contracts";
import { fetchCustomerById, fetchCustomerMatches, addCustomerNote } from "@/lib/api";
import { calculateAge } from "../../../../shared/contracts";
import { formatEnumText, formatAnnualIncome, formatDate } from "@/lib/formatters";
import { ProfileStatusBadge, MatchStatusBadge } from "@/components/common/StatusBadge";
import { LoadingState, ErrorState, EmptyState } from "@/components/common/FeedbackStates";
import { Button } from "@/components/ui/button";

interface CustomerDetailPageProps {
  matchmaker: DemoMatchmaker;
}

type DetailTab = "profile" | "preferences" | "history" | "notes";

export function CustomerDetailPage({ matchmaker }: CustomerDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [customer, setCustomer] = useState<CustomerRecord | null>(null);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeTab: DetailTab = (searchParams.get("tab") as DetailTab) || "profile";

  // Note form state
  const [noteBody, setNoteBody] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [custData, matchData] = await Promise.all([
        fetchCustomerById(id),
        fetchCustomerMatches(id)
      ]);
      setCustomer(custData);
      setMatches(matchData);
    } catch (err: any) {
      setError(err?.message || "Failed to load customer profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !noteBody.trim()) return;

    setSubmittingNote(true);
    setNoteError(null);
    try {
      const created = await addCustomerNote(id, {
        authorMatchmakerId: matchmaker.id,
        body: noteBody.trim()
      });
      // Update local customer notes
      if (customer) {
        setCustomer({
          ...customer,
          profile: {
            ...customer.profile,
            notes: [created, ...(customer.profile.notes || [])]
          }
        });
      }
      setNoteBody("");
    } catch (err: any) {
      setNoteError(err?.message || "Failed to submit note");
    } finally {
      setSubmittingNote(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading client dossier and matchmaking records..." />;
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <Link to="/customers">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Customers
          </Button>
        </Link>
        <ErrorState message={error || "Customer not found"} onRetry={loadData} />
      </div>
    );
  }

  // Enforce matchmaker assignment restriction
  if (customer.profile.assignedMatchmakerId !== matchmaker.id) {
    return (
      <div className="space-y-4">
        <Link to="/customers">
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Customers
          </Button>
        </Link>
        <ErrorState
          message={`Access restricted: Profile ${customer.profile.firstName} ${customer.profile.lastName} (${customer.profile.id}) is assigned to matchmaker ${customer.profile.assignedMatchmakerId}, not your account.`}
        />
      </div>
    );
  }

  const { profile, preferences } = customer;
  const age = calculateAge(profile.dateOfBirth);

  return (
    <div className="space-y-6">
      {/* Top Navigation Breadcrumb */}
      <div>
        <Link to="/customers">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted hover:text-ink pl-0">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Customer Directory
          </Button>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-surface rounded-[11px] border border-border p-6 shadow-xs flex items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white font-bold text-xl flex items-center justify-center shadow-xs">
            {profile.firstName.slice(0, 1)}
            {profile.lastName.slice(0, 1)}
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-[650] text-ink tracking-tight">
                {profile.firstName} {profile.lastName}
              </h2>
              <span className="text-sm text-muted">
                &bull; {age !== null ? `${age} years` : "Age unknown"}
              </span>
              <ProfileStatusBadge status={profile.profileStatus} />
            </div>

            <div className="flex items-center gap-4 text-xs text-body mt-1.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-muted" />
                {profile.location.city}, {profile.location.state}
              </span>
              <span>&bull;</span>
              <span>{formatEnumText(profile.maritalStatus)}</span>
              <span>&bull;</span>
              <span className="font-mono text-[11px] text-muted">ID: {profile.id}</span>
              <span>&bull;</span>
              <span>Assigned: <strong>{profile.assignedMatchmakerId}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Button
            onClick={() => setSearchParams({ tab: "history" })}
            className="h-10 text-xs px-5 shadow-xs"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Matchmaking & History ({matches.length})
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border bg-surface px-4 rounded-t-[11px]">
        <button
          onClick={() => setSearchParams({ tab: "profile" })}
          className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "profile"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          Personal & Biodata
        </button>

        <button
          onClick={() => setSearchParams({ tab: "preferences" })}
          className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "preferences"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Partner Preferences
        </button>

        <button
          onClick={() => setSearchParams({ tab: "history" })}
          className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "history"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Pairing History ({matches.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: "notes" })}
          className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "notes"
              ? "border-primary text-primary"
              : "border-transparent text-muted hover:text-ink"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Consultation Notes ({profile.notes?.length || 0})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PERSONAL & BIODATA */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Card: Personal & Contact */}
          <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block">Gender</span>
                <span className="font-medium text-ink">{profile.gender === "MAN" ? "Man" : "Woman"}</span>
              </div>
              <div>
                <span className="text-muted block">Date of Birth / Age</span>
                <span className="font-medium text-ink">{profile.dateOfBirth} ({age} yrs)</span>
              </div>
              <div>
                <span className="text-muted block">Height</span>
                <span className="font-medium text-ink">{profile.heightCm ? `${profile.heightCm} cm` : "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Marital Status</span>
                <span className="font-medium text-ink">{formatEnumText(profile.maritalStatus)}</span>
              </div>
              <div>
                <span className="text-muted block">Languages Known</span>
                <span className="font-medium text-ink">{profile.languagesKnown?.join(", ") || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Contact</span>
                <span className="font-medium text-ink font-mono text-[11px]">{profile.contact?.email}</span>
              </div>
            </div>
          </div>

          {/* Card: Education & Career */}
          <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Education & Career
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block">Highest Education</span>
                <span className="font-medium text-ink">{formatEnumText(profile.education?.highestEducation)}</span>
              </div>
              <div>
                <span className="text-muted block">Degree / College</span>
                <span className="font-medium text-ink">
                  {profile.education?.degree || "Not specified"} {profile.education?.undergraduateCollege ? `(${profile.education.undergraduateCollege})` : ""}
                </span>
              </div>
              <div>
                <span className="text-muted block">Employment Status</span>
                <span className="font-medium text-ink">{formatEnumText(profile.career?.employmentStatus)}</span>
              </div>
              <div>
                <span className="text-muted block">Profession / Role</span>
                <span className="font-medium text-ink">
                  {profile.career?.designation || profile.career?.professionCategory || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-muted block">Company</span>
                <span className="font-medium text-ink">{profile.career?.company || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Annual Income</span>
                <span className="font-medium text-ink">{formatAnnualIncome(profile.career?.annualIncome)}</span>
              </div>
            </div>
          </div>

          {/* Card: Family & Culture */}
          <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Home className="w-4 h-4 text-primary" /> Family & Cultural Background
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block">Family Structure</span>
                <span className="font-medium text-ink">{formatEnumText(profile.family?.familyStructure)}</span>
              </div>
              <div>
                <span className="text-muted block">Siblings</span>
                <span className="font-medium text-ink">{profile.family?.siblings ?? "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Religion</span>
                <span className="font-medium text-ink">{profile.culturalBackground?.religion || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Community</span>
                <span className="font-medium text-ink">{profile.culturalBackground?.community || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Card: Family Planning & Relationship Goals */}
          <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" /> Relationship & Family Planning
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-muted block">Relationship Goal</span>
                <span className="font-medium text-ink">{formatEnumText(profile.relationship?.relationshipGoal)}</span>
              </div>
              <div>
                <span className="text-muted block">Marriage Timeline</span>
                <span className="font-medium text-ink">{profile.relationship?.marriageTimeline || "Not specified"}</span>
              </div>
              <div>
                <span className="text-muted block">Children Preference</span>
                <span className="font-medium text-ink">{formatEnumText(profile.familyPlanning?.wantsChildren)}</span>
              </div>
              <div>
                <span className="text-muted block">Open to Relocate</span>
                <span className="font-medium text-ink">{formatEnumText(profile.relocation?.openToRelocate)}</span>
              </div>
            </div>
          </div>

          {/* Card: Lifestyle & Core Values (Spans 2 columns) */}
          <div className="col-span-2 bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Lifestyle & Declared Values
            </h3>
            
            <div className="grid grid-cols-4 gap-4 text-xs pb-3 border-b border-border">
              <div>
                <span className="text-muted block">Dietary Preference</span>
                <span className="font-medium text-ink">{formatEnumText(profile.lifestyle?.dietaryPreference)}</span>
              </div>
              <div>
                <span className="text-muted block">Smoking</span>
                <span className="font-medium text-ink">{formatEnumText(profile.lifestyle?.smoking)}</span>
              </div>
              <div>
                <span className="text-muted block">Drinking</span>
                <span className="font-medium text-ink">{formatEnumText(profile.lifestyle?.drinking)}</span>
              </div>
              <div>
                <span className="text-muted block">Open to Pets</span>
                <span className="font-medium text-ink">{formatEnumText(profile.lifestyle?.openToPets)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">
                  Declared Core Values
                </span>
                {profile.relationship?.coreValues?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.relationship.coreValues.map((v) => (
                      <span
                        key={v}
                        className="px-2.5 py-1 rounded-[6px] bg-primary-soft text-primary font-medium text-xs"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted italic">No core values declared</span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">
                  Hobbies & Interests
                </span>
                {profile.lifestyle?.hobbiesInterests?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.lifestyle.hobbiesInterests.map((h) => (
                      <span
                        key={h}
                        className="px-2.5 py-1 rounded-[6px] bg-surface-soft text-body font-medium text-xs"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted italic">No hobbies declared</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PARTNER PREFERENCES */}
      {/* ========================================================================= */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          {/* Ranges and Strictness */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">Preferred Age Range</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-soft text-body">
                  {preferences.preferredAgeRange?.importance || "FLEXIBLE"}
                </span>
              </div>
              <div className="text-lg font-semibold text-ink">
                {preferences.preferredAgeRange?.min || "Any"} &ndash;{" "}
                {preferences.preferredAgeRange?.max || "Any"} yrs
              </div>
            </div>

            <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">Preferred Height Range</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-soft text-body">
                  {preferences.preferredHeightRange?.importance || "FLEXIBLE"}
                </span>
              </div>
              <div className="text-lg font-semibold text-ink">
                {preferences.preferredHeightRange?.min || "Any"} &ndash;{" "}
                {preferences.preferredHeightRange?.max || "Any"} cm
              </div>
            </div>

            <div className="bg-surface rounded-[11px] border border-border p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted">Preferred Income Range</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-soft text-body">
                  {preferences.preferredIncomeRange?.importance || "FLEXIBLE"}
                </span>
              </div>
              <div className="text-sm font-semibold text-ink mt-1">
                {preferences.preferredIncomeRange?.min
                  ? `Min ₹${(preferences.preferredIncomeRange.min / 100000).toFixed(0)} L/yr`
                  : "Any"}{" "}
                &ndash;{" "}
                {preferences.preferredIncomeRange?.max
                  ? `Max ₹${(preferences.preferredIncomeRange.max / 100000).toFixed(0)} L/yr`
                  : "No Max"}
              </div>
            </div>
          </div>

          {/* Preference Details Card */}
          <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-5">
            <h3 className="text-sm font-semibold text-ink">Partner Criteria & Expectations</h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted block mb-1">Preferred Locations</span>
                <span className="font-medium text-ink">
                  {preferences.preferredLocations?.values?.join(", ") || "Open to any location"}
                </span>
              </div>

              <div>
                <span className="text-muted block mb-1">Preferred Marital Status</span>
                <span className="font-medium text-ink">
                  {preferences.preferredMaritalStatuses?.values?.map(formatEnumText).join(", ") || "Open"}
                </span>
              </div>

              <div>
                <span className="text-muted block mb-1">Preferred Education</span>
                <span className="font-medium text-ink">
                  {preferences.preferredHighestEducation?.values?.map(formatEnumText).join(", ") || "Open"}
                </span>
              </div>

              <div>
                <span className="text-muted block mb-1">Preferred Professions</span>
                <span className="font-medium text-ink">
                  {preferences.preferredProfessions?.values?.join(", ") || "Open to all professions"}
                </span>
              </div>

              <div>
                <span className="text-muted block mb-1">Children Preference</span>
                <span className="font-medium text-ink">
                  {formatEnumText(preferences.childrenPreference?.value)}
                </span>
              </div>

              <div>
                <span className="text-muted block mb-1">Relocation Stance</span>
                <span className="font-medium text-ink">
                  {formatEnumText(preferences.relocationPreference?.value)}
                </span>
              </div>
            </div>

            {/* Core Values Wanted */}
            <div className="pt-4 border-t border-border">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">
                Desired Values in Partner ({preferences.coreValues?.importance || "FLEXIBLE"})
              </span>
              {preferences.coreValues?.values?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {preferences.coreValues.values.map((v) => (
                    <span
                      key={v}
                      className="px-2.5 py-1 rounded-[6px] bg-primary-soft text-primary font-medium text-xs"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted italic">No specific partner values selected</span>
              )}
            </div>

            {/* Dealbreakers */}
            <div className="pt-4 border-t border-border">
              <span className="text-xs font-semibold text-danger uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" /> Explicit Dealbreakers
              </span>
              {preferences.dealbreakers?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {preferences.dealbreakers.map((d) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-[6px] bg-danger-soft text-danger font-medium text-xs"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted italic">
                  No hard dealbreakers declared. All criteria will be ranked softly by algorithm.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PAIRING HISTORY */}
      {/* ========================================================================= */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Candidate Pairings & Pipeline Stages</h3>
            <span className="text-xs text-muted">
              {matches.length} recorded pairings for this client
            </span>
          </div>

          {matches.length === 0 ? (
            <EmptyState
              title="No pairings created yet"
              description="This client has no existing match records. When you shortlist candidate profiles in Phase 5 & 6, they will appear here."
            />
          ) : (
            <div className="space-y-3">
              {matches.map((m) => {
                const partnerId = m.customerAId === profile.id ? m.customerBId : m.customerAId;

                return (
                  <div
                    key={m.id}
                    className="bg-surface rounded-[11px] border border-border p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-semibold text-ink">
                            Pairing with Candidate: <span className="font-mono text-primary">{partnerId}</span>
                          </span>
                          <MatchStatusBadge status={m.status} />
                          <span className="text-xs font-semibold text-primary bg-primary-soft px-2 py-0.5 rounded-md">
                            {m.compatibilityScore}% Compatibility
                          </span>
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Created {formatDate(m.createdAt)} by matchmaker {m.createdByMatchmakerId}
                        </p>
                      </div>

                      {m.followUpAt && (
                        <div className="text-right text-xs">
                          <span className="text-muted block">Next Follow-Up:</span>
                          <span className="font-medium text-warning flex items-center gap-1 justify-end">
                            <Clock className="w-3.5 h-3.5" /> {formatDate(m.followUpAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Proposal Status if shared */}
                    {m.proposal?.sharedAt && (
                      <div className="p-3 rounded-[7px] bg-primary-soft/50 border border-primary/10 text-xs">
                        <span className="font-semibold text-primary block mb-0.5">
                          Mock Proposal Shared on {formatDate(m.proposal.sharedAt)}
                        </span>
                        <p className="text-body italic">"{m.proposal.mockMessage}"</p>
                      </div>
                    )}

                    {/* Status History Events */}
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
                                  {ev.fromStatus ? `${ev.fromStatus} → ` : ""}{ev.toStatus}
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
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CONSULTATION NOTES */}
      {/* ========================================================================= */}
      {activeTab === "notes" && (
        <div className="grid grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="col-span-2 space-y-3">
            <h3 className="text-sm font-semibold text-ink">
              Matchmaker Consultation Notes ({profile.notes?.length || 0})
            </h3>

            {!profile.notes || profile.notes.length === 0 ? (
              <EmptyState
                title="No consultation notes"
                description="Record conversation summaries, personal preferences, and feedback for this client."
              />
            ) : (
              <div className="space-y-3">
                {profile.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-surface rounded-[11px] border border-border p-4 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink">
                        Author: <span className="font-mono text-primary">{note.authorMatchmakerId}</span>
                      </span>
                      <span className="text-muted">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-xs text-body leading-relaxed whitespace-pre-wrap">{note.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Note Form */}
          <div className="bg-surface rounded-[11px] border border-border p-5 shadow-xs h-fit space-y-3">
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
              Add New Note
            </h4>

            {noteError && (
              <div className="p-2.5 rounded-[7px] bg-danger-soft text-danger text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{noteError}</span>
              </div>
            )}

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={4}
                required
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                placeholder="Record consultation notes, call summaries, or specific client requests..."
                className="w-full rounded-[7px] border border-border-strong bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus-visible:outline-3 focus-visible:outline-primary"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  Logged as: <strong className="text-ink">{matchmaker.displayName}</strong>
                </span>
                <Button type="submit" disabled={submittingNote} size="sm" className="h-8 text-xs">
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
