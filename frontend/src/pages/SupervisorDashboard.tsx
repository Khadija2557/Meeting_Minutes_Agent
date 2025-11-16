import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AgentCard } from "@/components/AgentCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { AgentTeam } from "@/components/AgentTeam";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Users, Activity, BarChart3, Settings } from "lucide-react";

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

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const agents = [
    { name: "Parker", role: "Progress Accountability Agent", avatar: progressIcon, status: "active" as const, lastActivity: "Just now", tasksCompleted: 12, responseTime: "1.5s" },
    { name: "Ivy", role: "Email Priority Agent", avatar: emailPriorityIcon, status: "active" as const, lastActivity: "1 min ago", tasksCompleted: 8, responseTime: "0.9s" },
    { name: "Summer", role: "Document Summarizer Agent", avatar: documentSummarizerIcon, status: "active" as const, lastActivity: "3 min ago", tasksCompleted: 15, responseTime: "1.1s" },
    { name: "Harper", role: "Hiring Screener Agent", avatar: hiringIcon, status: "idle" as const, lastActivity: "10 min ago", tasksCompleted: 4, responseTime: "1.8s" },
    { name: "Alex", role: "Meeting Follow-up Agent", avatar: alexAvatar, status: "active" as const, lastActivity: "2 min ago", tasksCompleted: 47, responseTime: "1.2s", route: "/alex" },
    { name: "Owen", role: "Onboarding Buddy Agent", avatar: onboardingBuddyIcon, status: "active" as const, lastActivity: "2 min ago", tasksCompleted: 6, responseTime: "1.4s" },
    { name: "Caleb", role: "Calendar Conflict Resolver Agent", avatar: calendarConflictIcon, status: "active" as const, lastActivity: "5 min ago", tasksCompleted: 9, responseTime: "1.0s" },
    { name: "Nova", role: "Knowledge Base Builder Agent", avatar: knowledgeBaseIcon, status: "idle" as const, lastActivity: "12 min ago", tasksCompleted: 3, responseTime: "2.0s" },
    { name: "Quinn", role: "Task Dependency Agent", avatar: taskDependencyIcon, status: "active" as const, lastActivity: "4 min ago", tasksCompleted: 7, responseTime: "1.3s" },
    { name: "Finley", role: "Budget Tracker Agent", avatar: budgetTrackerIcon, status: "active" as const, lastActivity: "6 min ago", tasksCompleted: 5, responseTime: "1.6s" },
    { name: "Reed", role: "Document Reviewer Agent", avatar: documentReviewerIcon, status: "active" as const, lastActivity: "7 min ago", tasksCompleted: 11, responseTime: "1.2s" },
    { name: "Lia", role: "Communication Optimizer Agent", avatar: communicationOptimizerIcon, status: "active" as const, lastActivity: "1 min ago", tasksCompleted: 10, responseTime: "1.0s" },
    { name: "Dax", role: "Deadline Guardian Agent", avatar: deadlineGuardianIcon, status: "active" as const, lastActivity: "2 min ago", tasksCompleted: 9, responseTime: "1.1s" },
    { name: "Zen", role: "Focus Enforcer Agent", avatar: focusEnforcerIcon, status: "active" as const, lastActivity: "Just now", tasksCompleted: 13, responseTime: "0.8s" },
  ];

  const activities = [
    {
      id: "1",
      agentName: "Alex",
      message: "Successfully summarized meeting M_47 with 5 action items extracted",
      type: "success" as const,
      timestamp: "2 min ago",
    },
    {
      id: "2",
      agentName: "Parker",
      message: "Completed progress review for project Alpha, 3 tasks behind schedule",
      type: "info" as const,
      timestamp: "5 min ago",
    },
    {
      id: "3",
      agentName: "Ivy",
      message: "Prioritized 12 emails, flagged 3 as urgent for immediate response",
      type: "success" as const,
      timestamp: "8 min ago",
    },
    {
      id: "4",
      agentName: "Summer",
      message: "Summarized 45-page quarterly report into key insights",
      type: "success" as const,
      timestamp: "12 min ago",
    },
    {
      id: "5",
      agentName: "Harper",
      message: "Screened 8 candidate applications, shortlisted 3 for interviews",
      type: "info" as const,
      timestamp: "15 min ago",
    },
    {
      id: "6",
      agentName: "Owen",
      message: "Completed onboarding checklist for new team member Sarah",
      type: "success" as const,
      timestamp: "18 min ago",
    },
    {
      id: "7",
      agentName: "Caleb",
      message: "Resolved scheduling conflict between marketing and engineering teams",
      type: "success" as const,
      timestamp: "22 min ago",
    },
    {
      id: "8",
      agentName: "Nova",
      message: "Updated knowledge base with latest API documentation",
      type: "info" as const,
      timestamp: "25 min ago",
    },
    {
      id: "9",
      agentName: "Quinn",
      message: "Identified task dependencies for upcoming product launch",
      type: "info" as const,
      timestamp: "30 min ago",
    },
    {
      id: "10",
      agentName: "Finley",
      message: "Project budget approaching 85% threshold - monitoring closely",
      type: "info" as const,
      timestamp: "35 min ago",
    },
    {
      id: "11",
      agentName: "Reed",
      message: "Reviewed and approved technical specification document",
      type: "success" as const,
      timestamp: "40 min ago",
    },
    {
      id: "12",
      agentName: "Lia",
      message: "Optimized team communication workflow, reduced meeting time by 15%",
      type: "success" as const,
      timestamp: "45 min ago",
    },
    {
      id: "13",
      agentName: "Dax",
      message: "Sent deadline reminders for 3 upcoming project milestones",
      type: "info" as const,
      timestamp: "50 min ago",
    },
    {
      id: "14",
      agentName: "Zen",
      message: "Blocked 2 hours of focused work time for deep analysis task",
      type: "info" as const,
      timestamp: "55 min ago",
    },
    {
      id: "15",
      agentName: "Alex",
      message: "Started transcription for meeting M_48 with engineering team",
      type: "info" as const,
      timestamp: "1 hour ago",
    }
  ];

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold mb-2">
            <span className="gradient-text">MetaVerse</span>
          </h1>
          <p className="text-3xl font-semibold mb-2">Multi-Agent System</p>
          <p className="text-2xl text-muted-foreground">
            Your <span className="gradient-text">24/7 AI Team</span>
          </p>
        </header>

        {/* Agent Team Showcase */}
        <AgentTeam />

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-8 border-glow-purple hover:border-glow-pink transition-all duration-500">
            <TabsTrigger value="overview" className="gap-2">
              <Users className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="gap-2">
              <Users className="w-4 h-4" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Performance Metrics */}
            <PerformanceMetrics />

            {/* Agents Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Active Agents</h2>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search agents..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent, index) => (
                  <div
                    key={agent.name}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <AgentCard
                      {...agent}
                      onClick={() => {
                        if (agent.name === "Alex") {
                          navigate("/alex");
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <ActivityFeed activities={activities} />
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">All Agents</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.name}
                  {...agent}
                  onClick={() => {
                    if (agent.name === "Alex") {
                      navigate("/alex");
                    }
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activities={activities} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-8">
              <PerformanceMetrics />
              <div className="text-center py-20 text-muted-foreground">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Detailed analytics dashboard coming soon...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}