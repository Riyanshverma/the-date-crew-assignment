import type { MatchStatus, ProfileStatus } from "../../../../shared/contracts";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, PauseCircle, XCircle, ArrowRightCircle, Sparkles } from "lucide-react";

interface ProfileStatusBadgeProps {
  status: ProfileStatus;
  className?: string;
}

export function ProfileStatusBadge({ status, className }: ProfileStatusBadgeProps) {
  if (status === "ACTIVE") {
    return (
      <Badge tone="positive" className={className}>
        <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />
        Active (Ready)
      </Badge>
    );
  }

  return (
    <Badge tone="warning" className={className}>
      <Clock className="w-3 h-3 mr-1 inline-block" />
      Incomplete
    </Badge>
  );
}

interface MatchStatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

const MATCH_STATUS_CONFIG: Record<
  MatchStatus,
  { label: string; tone: "primary" | "positive" | "warning" | "neutral"; icon: typeof Sparkles }
> = {
  SHORTLISTED: { label: "Shortlisted", tone: "neutral", icon: Clock },
  PROPOSAL_SHARED: { label: "Proposal Shared", tone: "primary", icon: ArrowRightCircle },
  CLIENT_INTERESTED: { label: "Client Interested", tone: "primary", icon: Sparkles },
  AWAITING_OTHER_PERSON: { label: "Awaiting Other Party", tone: "warning", icon: Clock },
  BOTH_INTERESTED: { label: "Both Interested", tone: "positive", icon: CheckCircle2 },
  INTRODUCTION_ARRANGED: { label: "Intro Arranged", tone: "positive", icon: Sparkles },
  AWAITING_FEEDBACK: { label: "Awaiting Feedback", tone: "warning", icon: Clock },
  IN_PROGRESS: { label: "In Progress", tone: "primary", icon: ArrowRightCircle },
  DECLINED: { label: "Declined", tone: "neutral", icon: XCircle },
  ON_HOLD: { label: "On Hold", tone: "warning", icon: PauseCircle },
  CLOSED: { label: "Closed", tone: "neutral", icon: XCircle }
};

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const config = MATCH_STATUS_CONFIG[status] ?? {
    label: status,
    tone: "neutral" as const,
    icon: Clock
  };
  const Icon = config.icon;

  return (
    <Badge tone={config.tone} className={className}>
      <Icon className="w-3 h-3 mr-1 inline-block" />
      {config.label}
    </Badge>
  );
}
