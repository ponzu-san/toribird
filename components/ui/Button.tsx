import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    "bg-primary text-white shadow-pop hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
  secondary:
    "border border-border bg-surface-elevated text-foreground shadow-pop hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/30",
  ghost: "text-muted hover:bg-sky-soft hover:text-primary",
};

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
        variantStyles[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
