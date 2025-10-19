import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus-modern active:scale-95";

  const variants = {
    primary:
      "gradient-primary text-primary-foreground shadow-modern-md hover:shadow-modern-lg",
    secondary:
      "bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-modern-sm",
    danger:
      "gradient-destructive text-destructive-foreground shadow-modern-md hover:shadow-modern-lg",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 shadow-modern-sm",
    ghost: "text-card-foreground hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
