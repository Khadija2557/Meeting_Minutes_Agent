import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, CheckCircle2 } from "lucide-react";

interface AgentCardProps {
  name: string;
  role: string;
  avatar: string;
  status: "active" | "idle" | "error";
  lastActivity: string;
  tasksCompleted: number;
  responseTime: string;
  onClick?: () => void;
}

export const AgentCard = ({
  name,
  role,
  avatar,
  status,
  lastActivity,
  tasksCompleted,
  responseTime,
  onClick,
}: AgentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    active: "bg-lightGreen",
    idle: "bg-lightYellow",
    error: "bg-pink",
  };

  const statusLabels = {
    active: "Active",
    idle: "Idle",
    error: "Error",
  };

  const cardGlowColors = ['border-glow-pink', 'border-glow-blue', 'border-glow-purple', 'border-glow-green'];
  const randomGlow = cardGlowColors[Math.floor(Math.random() * cardGlowColors.length)];

  return (
    <Card
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 bg-card/80 backdrop-blur-sm ${randomGlow} hover:scale-105 ${
        isHovered ? "shadow-2xl" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Avatar and Status */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted shimmer floating-animation">
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusColors[status]} rounded-full border-2 border-card pulse-glow`}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              className="mt-2"
            >
              {statusLabels[status]}
            </Badge>
          </div>
        </div>

        {/* Metrics */}
        {isHovered && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-blue" />
              <span className="text-muted-foreground">Last Activity:</span>
              <span className="font-medium">{lastActivity}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-lightGreen" />
              <span className="text-muted-foreground">Tasks Completed:</span>
              <span className="font-medium">{tasksCompleted}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-purple" />
              <span className="text-muted-foreground">Response Time:</span>
              <span className="font-medium">{responseTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover gradient overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink/5 via-blue/5 to-purple/5 pointer-events-none" />
      )}
    </Card>
  );
};
