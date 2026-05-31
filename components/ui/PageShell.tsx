import { type ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  width?: "narrow" | "wide";
  className?: string;
}

const widthMap = {
  narrow: "max-w-lg",
  wide: "max-w-7xl",
};

export default function PageShell({ children, width = "narrow", className = "" }: PageShellProps) {
  return (
    <main className={`min-h-screen bg-surface pb-24 lg:pb-10 ${className}`}>
      <div className={`mx-auto px-5 py-5 lg:px-6 lg:py-8 ${widthMap[width]}`}>{children}</div>
    </main>
  );
}
