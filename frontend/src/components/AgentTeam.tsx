import alexAvatar from "@/assets/alex-avatar.png";
import supervisorAvatar from "@/assets/supervisor-avatar.png";
import coderAvatar from "@/assets/agent-coder.png";
import analystAvatar from "@/assets/agent-analyst.png";
import supportAvatar from "@/assets/agent-support.png";
import { Sparkles } from "lucide-react";

export const AgentTeam = () => {
  const agents = [
    {
      name: "CodeMaster",
      avatar: coderAvatar,
      position: "left-[5%] top-[20%]",
      size: "w-24 h-24",
      delay: "0s",
      glowColor: "glow-blue",
      borderColor: "border-blue/50",
    },
    {
      name: "Alex",
      avatar: alexAvatar,
      position: "left-[20%] top-[35%]",
      size: "w-28 h-28",
      delay: "0.2s",
      glowColor: "glow-pink",
      borderColor: "border-pink/50",
    },
    {
      name: "Supervisor",
      avatar: supervisorAvatar,
      position: "left-[50%] -translate-x-1/2 top-[10%]",
      size: "w-40 h-40",
      delay: "0.1s",
      isSupervisor: true,
      glowColor: "glow-purple",
      borderColor: "border-purple",
    },
    {
      name: "DataWiz",
      avatar: analystAvatar,
      position: "right-[20%] top-[35%]",
      size: "w-28 h-28",
      delay: "0.3s",
      glowColor: "glow-green",
      borderColor: "border-lightGreen/50",
    },
    {
      name: "SupportBot",
      avatar: supportAvatar,
      position: "right-[5%] top-[20%]",
      size: "w-24 h-24",
      delay: "0.4s",
      glowColor: "glow-yellow",
      borderColor: "border-lightYellow/50",
    },
  ];

  return (
    <div className="relative w-full h-[400px] mb-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple/5 via-blue/5 to-pink/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple/10 rounded-full blur-3xl" />
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue/10 rounded-full blur-3xl" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-pink/10 rounded-full blur-3xl" />
      
      {/* Floating sparkles */}
      <div className="absolute top-[15%] left-[45%] animate-pulse">
        <Sparkles className="w-6 h-6 text-purple/70" />
      </div>
      <div className="absolute top-[25%] right-[40%] animate-pulse" style={{ animationDelay: "0.5s" }}>
        <Sparkles className="w-4 h-4 text-blue/70" />
      </div>
      <div className="absolute top-[40%] left-[35%] animate-pulse" style={{ animationDelay: "1s" }}>
        <Sparkles className="w-5 h-5 text-pink/70" />
      </div>
      <div className="absolute top-[50%] right-[30%] animate-pulse" style={{ animationDelay: "1.5s" }}>
        <Sparkles className="w-4 h-4 text-lightGreen/70" />
      </div>

      {/* Agent avatars */}
      <div className="relative w-full h-full">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`absolute ${agent.position} ${agent.size} floating-animation cursor-pointer group`}
            style={{ animationDelay: agent.delay }}
          >
            {/* Glow ring */}
            <div
              className={`absolute inset-0 rounded-full ${agent.glowColor} transition-all duration-300 group-hover:scale-110`}
            />
            
            {/* Avatar */}
            <div
              className={`relative w-full h-full rounded-full overflow-hidden bg-card border-4 ${agent.borderColor} transition-all duration-300 group-hover:scale-110`}
            >
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name tag on hover */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className={`bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full border-2 ${agent.borderColor} text-sm font-medium`}>
                {agent.name}
              </div>
            </div>

            {/* Status indicator for supervisor */}
            {agent.isSupervisor && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-lightGreen rounded-full border-4 border-background pulse-glow flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Team label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center animate-fade-in">
        <div className="bg-card/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-purple/40 glow-rainbow">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-3 h-3 bg-lightGreen rounded-full animate-pulse" />
            <span className="text-lg font-semibold gradient-text">Your AI Team</span>
            <span className="text-sm text-muted-foreground">• Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
