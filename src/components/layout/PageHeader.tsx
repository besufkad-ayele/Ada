import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  highlight?: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ icon: Icon, title, highlight, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-white/5">
      <div>
        <h1 className="flex items-center text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
          {Icon && (
            <span className="mr-4 h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </span>
          )}
          <span>
            {title}
            {highlight && (
              <>
                {" "}
                <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  {highlight}
                </span>
              </>
            )}
          </span>
        </h1>
        {description && (
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
