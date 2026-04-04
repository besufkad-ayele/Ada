import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const modernBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 border",
  {
    variants: {
      variant: {
        primary:
          "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30",
        success:
          "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
        warning:
          "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30",
        error:
          "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30",
        info:
          "bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30",
        neutral:
          "bg-white/10 text-white border-white/20 hover:bg-white/20",
        outline: 
          "bg-transparent text-slate-300 border-white/20 hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ModernBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modernBadgeVariants> {}

export function ModernBadge({ className, variant, ...props }: ModernBadgeProps) {
  return (
    <div className={cn(modernBadgeVariants({ variant }), className)} {...props} />
  );
}
