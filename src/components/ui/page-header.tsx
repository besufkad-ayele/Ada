import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  highlight?: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  icon: Icon,
  title,
  highlight,
  description,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6",
      "pb-8 mb-8 border-b border-white/5",
      className
    )}>
      <div className="flex-1">
        <div className="flex items-start gap-4 mb-3">
          {Icon && (
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
              <Icon className="h-7 w-7 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
              {title}
              {highlight && (
                <>
                  {" "}
                  <span className="bg-gradient-to-r from-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {highlight}
                  </span>
                </>
              )}
            </h1>
            {badge && <div className="mt-2">{badge}</div>}
          </div>
        </div>
        {description && (
          <p className="text-slate-400 text-base md:text-lg max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="shrink-0 flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
