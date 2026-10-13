import type { ReactNode } from "react";
import { AlertCircle, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = "Loading data...", className = "" }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
      <p className="text-xs font-medium text-muted">{message}</p>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: typeof FolderOpen;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = FolderOpen,
  action,
  className = ""
}: EmptyStateProps) {
  return (
    <div
      className={`bg-surface border border-dashed border-border rounded-[11px] p-10 flex flex-col items-center text-center max-w-md mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center text-muted mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      <p className="text-xs text-muted mb-5 leading-relaxed">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline" className="h-9 text-xs">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className = ""
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`bg-danger-soft/60 border border-danger/20 rounded-[11px] p-6 text-center max-w-md mx-auto ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-danger-soft flex items-center justify-center text-danger mx-auto mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-danger mb-1">{title}</h3>
      <p className="text-xs text-body mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="h-8 text-xs border-danger/30 text-danger hover:bg-danger-soft"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
