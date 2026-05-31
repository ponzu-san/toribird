import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "today" | "muted" | "category";
  className?: string;
}

const variantStyles = {
  default: "bg-primary text-white",
  success: "border border-pine/20 bg-pine/10 text-pine",
  today: "border border-fields/50 bg-fields text-foreground",
  muted: "border border-border bg-surface text-muted",
  category: "border border-border bg-sky-soft text-primary",
};

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
