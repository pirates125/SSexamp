import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: string | { value: string; isPositive: boolean };
  trendUp?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  className = "",
}: StatsCardProps) {
  // Trend'i normalize et
  let trendValue: string | undefined;
  let trendIsPositive: boolean | undefined;

  if (typeof trend === "object" && trend !== null) {
    trendValue = trend.value;
    trendIsPositive = trend.isPositive;
  } else if (typeof trend === "string") {
    trendValue = trend;
    trendIsPositive = trendUp;
  }

  return (
    <div
      className={`bg-card text-card-foreground rounded-2xl shadow-modern-md border border-border p-6 transition-all duration-300 hover:shadow-modern-lg hover:scale-[1.02] animate-scale-in ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground dark:text-white mb-2 tracking-tight">
            {value}
          </p>

          {trendValue && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-semibold ${
                  trendIsPositive ? "text-success" : "text-destructive"
                }`}
              >
                {trendIsPositive ? "↗" : "↘"}
              </span>
              <span
                className={`text-xs font-medium ${
                  trendIsPositive ? "text-success" : "text-destructive"
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="ml-4 p-4 bg-primary/10 rounded-xl">
            <Icon className="text-primary" size={28} />
          </div>
        )}
      </div>
    </div>
  );
}
