import { Card } from "@/components/ui/card";
import { TrendingUp, Zap, Target, Clock } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

export const PerformanceMetrics = () => {
  const metrics: Metric[] = [
    {
      label: "Total Tasks",
      value: "1,234",
      icon: <Target className="w-5 h-5" />,
      trend: "+12%",
    },
    {
      label: "Avg Response Time",
      value: "1.2s",
      icon: <Clock className="w-5 h-5" />,
      trend: "-8%",
    },
    {
      label: "Success Rate",
      value: "98.5%",
      icon: <TrendingUp className="w-5 h-5" />,
      trend: "+2.3%",
    },
    {
      label: "Active Agents",
      value: "5/5",
      icon: <Zap className="w-5 h-5" />,
      trend: "100%",
    },
  ];

  const cardColors = ['border-glow-pink', 'border-glow-blue', 'border-glow-purple', 'border-glow-green'];
  const iconBgColors = ['bg-pink/10 text-pink', 'bg-blue/10 text-blue', 'bg-purple/10 text-purple', 'bg-lightGreen/10 text-lightGreen'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={metric.label}
          className={`p-6 bg-card/80 backdrop-blur-sm ${cardColors[index % cardColors.length]} hover:scale-105 transition-all duration-300 animate-scale-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${iconBgColors[index % iconBgColors.length]}`}>
              {metric.icon}
            </div>
            {metric.trend && (
              <span className="text-xs font-medium text-lightGreen">
                {metric.trend}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold mb-1">{metric.value}</div>
          <div className="text-sm text-muted-foreground">{metric.label}</div>
        </Card>
      ))}
    </div>
  );
};
