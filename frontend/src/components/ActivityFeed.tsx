import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface Activity {
  id: string;
  agentName: string;
  message: string;
  type: "success" | "error" | "info";
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getIcon = (type: Activity["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-lightGreen" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-pink" />;
      case "info":
        return <Info className="w-4 h-4 text-blue" />;
    }
  };

  const cardColors = ['border-glow-pink', 'border-glow-blue', 'border-glow-purple', 'border-glow-green', 'border-glow-yellow'];

  return (
    <div className="bg-card/80 backdrop-blur-sm border-glow-purple hover:border-glow-blue transition-all duration-500 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="gradient-text">Activity Feed</span>
      </h3>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex gap-3 p-3 rounded-lg bg-card/80 backdrop-blur-sm ${cardColors[index % cardColors.length]} hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mt-1">{getIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {activity.agentName}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm">{activity.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
