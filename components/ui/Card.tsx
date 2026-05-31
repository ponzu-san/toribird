import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingMap = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({ children, className = "", padding = "md", hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface-elevated shadow-pop ${paddingMap[padding]} ${
        hover ? "transition-all duration-200 hover:border-primary/40 hover:shadow-pop-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
