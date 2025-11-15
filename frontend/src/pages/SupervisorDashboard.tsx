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

import alexAvatar from "@/assets/alex-avatar.png";
import supervisorAvatar from "@/assets/supervisor-avatar-new.png";
import coderAvatar from "@/assets/agent-coder.png";
import analystAvatar from "@/assets/agent-analyst.png";
import supportAvatar from "@/assets/agent-support.png";

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const agents = [
    {
      id: "agent_004",
      name: "Alex",
      role: "Meeting Minutes",
      status: "active" as const,
      tasksCompleted: 47,
      tasksInProgress: 2,
      efficiency: 96,
      avatar: alexAvatar,
      route: "/alex",
      lastActivity: "2 min ago",
      responseTime: "1.2s",
    },
    {
      name: "Supervisor",
      role: "Team Coordinator",
      avatar: supervisorAvatar,
      status: "active" as const,
      lastActivity: "Just now",
      tasksCompleted: 156,
      responseTime: "0.8s",
    },
    {
      name: "CodeMaster",
      role: "Development Agent",
      avatar: coderAvatar,
      status: "active" as const,
      lastActivity: "5 min ago",
      tasksCompleted: 89,
      responseTime: "2.1s",
    },
    {
      name: "DataWiz",
      role: "Analytics Agent",
      avatar: analystAvatar,
      status: "idle" as const,
      lastActivity: "15 min ago",
      tasksCompleted: 134,
      responseTime: "1.5s",
    },
    {
      name: "SupportBot",
      role: "Customer Service Agent",
      avatar: supportAvatar,
      status: "active" as const,
      lastActivity: "1 min ago",
      tasksCompleted: 203,
      responseTime: "0.9s",
    },
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
      agentName: "CodeMaster",
      message: "Deployed new feature to production environment",
      type: "success" as const,
      timestamp: "5 min ago",
    },
    {
      id: "3",
      agentName: "SupportBot",
      message: "Resolved customer inquiry #1245 successfully",
      type: "success" as const,
      timestamp: "8 min ago",
    },
    {
      id: "4",
      agentName: "DataWiz",
      message: "Generated monthly analytics report",
      type: "info" as const,
      timestamp: "15 min ago",
    },
    {
      id: "5",
      agentName: "Alex",
      message: "Started transcription for meeting M_48",
      type: "info" as const,
      timestamp: "18 min ago",
    },
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
