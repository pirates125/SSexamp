import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-card-foreground tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-card border border-input rounded-xl text-card-foreground 
            placeholder:text-muted-foreground focus-modern focus:border-primary
            transition-all duration-300 hover:border-primary/50
            ${
              error ? "border-destructive focus:border-destructive" : ""
            } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive font-medium animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
