import { type ReactNode } from "react";
import { BirdSilhouette, Footprints } from "@/components/icons/BirdDecor";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function EmptyState({ title, description, icon, children, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl border border-dashed border-border bg-sky-soft/50 px-6 py-10 text-center ${className}`}
    >
      <div className="relative mb-4">
        {icon ?? <BirdSilhouette className="h-14 w-14 text-primary" />}
        <Footprints className="absolute -bottom-1 left-1/2 h-6 w-12 -translate-x-1/2 text-fields animate-footprint" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted">{description}</p>}
      {children}
    </div>
  );
}
