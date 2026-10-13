import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", {
  variants: {
    tone: {
      positive: "bg-[var(--positive-soft)] text-[var(--positive)]",
      warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
      neutral: "bg-[var(--surface-soft)] text-[var(--body)]",
      primary: "bg-[var(--primary-soft)] text-[var(--primary)]"
    }
  },
  defaultVariants: { tone: "neutral" }
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
