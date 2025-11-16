import { Sparkles } from "lucide-react";

// Import all agent avatars including supervisor
import alexAvatar from "@/assets/meeting-followup-agent.png";
import progressIcon from "@/assets/progress-accountability-agent.png";
import hiringIcon from "@/assets/hiring-screener-agent.png";
import taskDependencyIcon from "@/assets/task-dependency-agent.png";
import deadlineGuardianIcon from "@/assets/deadline-guardian-agent.png";
import emailPriorityIcon from "@/assets/email-priority-agent.png";
import calendarConflictIcon from "@/assets/calendar-conflict-resolver-agent.png";
import budgetTrackerIcon from "@/assets/budget-tracker-agent.png";
import focusEnforcerIcon from "@/assets/focus-enforcer-agent.png";
import documentSummarizerIcon from "@/assets/document-summarizer-agent.png";
import onboardingBuddyIcon from "@/assets/onboarding-buddy-agent.png";
import knowledgeBaseIcon from "@/assets/knowledge-base-builder-agent.png";
import documentReviewerIcon from "@/assets/document-reviewer-agent.png";
import communicationOptimizerIcon from "@/assets/communication-optimizer-agent.png";
import supervisorAvatar from "@/assets/supervisor-agent.png";

export const AgentTeam = () => {
  const agents = [
    // Supervisor - CENTER (added to existing layout)
    {
      name: "Supervisor",
      avatar: supervisorAvatar,
      position: "left-[45%] top-[40%]",
      size: "w-32 h-32", 
      delay: "0s",
      isSupervisor: true,
      glowColor: "glow-purple",
      borderColor: "border-purple",
      role: "System Supervisor"
    },
    // Existing agents - positions unchanged
    {
      name: "Parker",
      role: "Progress Accountability Agent",
      avatar: progressIcon,
      position: "left-[5%] top-[10%]",
      size: "w-20 h-20",
      delay: "0.1s",
      glowColor: "glow-blue",
      borderColor: "border-blue/50",
    },
    {
      name: "Ivy",
      role: "Email Priority Agent",
      avatar: emailPriorityIcon,
      position: "left-[15%] top-[25%]",
      size: "w-20 h-20",
      delay: "0.2s",
      glowColor: "glow-pink",
      borderColor: "border-pink/50",
    },
    {
      name: "Summer",
      role: "Document Summarizer Agent",
      avatar: documentSummarizerIcon,
      position: "left-[5%] top-[45%]",
      size: "w-20 h-20",
      delay: "0.3s",
      glowColor: "glow-purple",
      borderColor: "border-purple/50",
    },
    {
      name: "Harper",
      role: "Hiring Screener Agent",
      avatar: hiringIcon,
      position: "left-[15%] top-[65%]",
      size: "w-20 h-20",
      delay: "0.4s",
      glowColor: "glow-green",
      borderColor: "border-lightGreen/50",
    },
    {
      name: "Alex",
      role: "Meeting Follow-up Agent",
      avatar: alexAvatar,
      position: "left-[25%] top-[35%]",
      size: "w-24 h-24",
      delay: "0.5s",
      glowColor: "glow-pink",
      borderColor: "border-pink/50",
    },
    {
      name: "Owen",
      role: "Onboarding Buddy Agent",
      avatar: onboardingBuddyIcon,
      position: "left-[35%] top-[15%]",
      size: "w-20 h-20",
      delay: "0.6s",
      glowColor: "glow-yellow",
      borderColor: "border-lightYellow/50",
    },
    {
      name: "Caleb",
      role: "Calendar Conflict Resolver Agent",
      avatar: calendarConflictIcon,
      position: "left-[35%] top-[55%]",
      size: "w-20 h-20",
      delay: "0.7s",
      glowColor: "glow-blue",
      borderColor: "border-blue/50",
    },
    {
      name: "Nova",
      role: "Knowledge Base Builder Agent",
      avatar: knowledgeBaseIcon,
      position: "right-[35%] top-[15%]",
      size: "w-20 h-20",
      delay: "0.8s",
      glowColor: "glow-purple",
      borderColor: "border-purple/50",
    },
    {
      name: "Quinn",
      role: "Task Dependency Agent",
      avatar: taskDependencyIcon,
      position: "right-[35%] top-[55%]",
      size: "w-20 h-20",
      delay: "0.9s",
      glowColor: "glow-green",
      borderColor: "border-lightGreen/50",
    },
    {
      name: "Finley",
      role: "Budget Tracker Agent",
      avatar: budgetTrackerIcon,
      position: "right-[25%] top-[35%]",
      size: "w-24 h-24",
      delay: "1.0s",
      glowColor: "glow-yellow",
      borderColor: "border-lightYellow/50",
    },
    {
      name: "Reed",
      role: "Document Reviewer Agent",
      avatar: documentReviewerIcon,
      position: "right-[15%] top-[65%]",
      size: "w-20 h-20",
      delay: "1.1s",
      glowColor: "glow-blue",
      borderColor: "border-blue/50",
    },
    {
      name: "Lia",
      role: "Communication Optimizer Agent",
      avatar: communicationOptimizerIcon,
      position: "right-[5%] top-[45%]",
      size: "w-20 h-20",
      delay: "1.2s",
      glowColor: "glow-pink",
      borderColor: "border-pink/50",
    },
    {
      name: "Dax",
      role: "Deadline Guardian Agent",
      avatar: deadlineGuardianIcon,
      position: "right-[15%] top-[25%]",
      size: "w-20 h-20",
      delay: "1.3s",
      glowColor: "glow-purple",
      borderColor: "border-purple/50",
    },
    {
      name: "Zen",
      role: "Focus Enforcer Agent",
      avatar: focusEnforcerIcon,
      position: "right-[5%] top-[10%]",
      size: "w-20 h-20",
      delay: "1.4s",
      glowColor: "glow-green",
      borderColor: "border-lightGreen/50",
    }
  ];

  return (
    <div className="relative w-full h-[500px] mb-12 overflow-hidden">
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
              className={`relative w-full h-full rounded-full overflow-hidden bg-card border-4 ${agent.borderColor} transition-all duration-300 group-hover:scale-110 ${
                agent.isSupervisor ? 'border-4 border-purple ring-4 ring-purple/20' : ''
              }`}
            >
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name tag on hover */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-center">
              <div className={`bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full border-2 ${agent.borderColor} text-sm font-medium ${
                agent.isSupervisor ? 'font-bold text-purple' : ''
              }`}>
                {agent.name}
                {agent.isSupervisor && (
                  <span className="ml-1 text-xs">👑</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1 bg-card/80 backdrop-blur-sm px-2 py-1 rounded max-w-[120px] truncate">
                {agent.isSupervisor ? 'System Supervisor' : `${agent.role.split(' ')[0]}...`}
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
            <span className="text-sm text-muted-foreground">• {agents.length} Agents Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};