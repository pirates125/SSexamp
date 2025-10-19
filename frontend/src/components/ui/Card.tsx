import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-card text-card-foreground rounded-2xl shadow-modern-md border border-border transition-all duration-300 hover:shadow-modern-lg hover:scale-[1.01] animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`px-6 py-5 border-b border-border ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardProps) {
  return (
    <h3
      className={`text-xl font-semibold text-card-foreground tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
}
