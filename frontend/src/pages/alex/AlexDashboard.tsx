import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HamburgerMenu } from "@/components/HamburgerMenu";
import {
  ArrowLeft,
  Upload,
  FileAudio,
  CheckCircle2,
  Clock,
  History,
  ListTodo,
  Settings,
  Calendar,
  TrendingUp,
} from "lucide-react";
import alexAvatar from "@/assets/alex-avatar.png";

export default function AlexDashboard() {
  const navigate = useNavigate();
  const [stats] = useState({
    totalMeetings: 47,
    totalActionItems: 156,
    pendingActionItems: 23,
  });

  const recentMeetings = [
    {
      id: "M_47",
      title: "Q4 Planning Meeting",
      date: "2025-01-15",
      duration: "45 min",
      actionItems: 5,
      status: "completed",
    },
    {
      id: "M_46",
      title: "Product Review Session",
      date: "2025-01-12",
      duration: "30 min",
      actionItems: 3,
      status: "completed",
    },
    {
      id: "M_45",
      title: "Client Presentation",
      date: "2025-01-10",
      duration: "60 min",
      actionItems: 7,
      status: "completed",
    },
  ];

  const menuItems = [
    { label: "Dashboard", path: "/alex" },
    { label: "Process Meeting", path: "/alex/process-meeting" },
    { label: "History", path: "/alex/history" },
    { label: "Action Items", path: "/alex/action-items" },
    { label: "Settings", path: "/alex/settings" },
    { label: "Back to Home", path: "/" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <HamburgerMenu items={menuItems} />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:glow-cyan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3 flex-1">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-muted floating-animation">
              <img src={alexAvatar} alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Alex</h1>
              <p className="text-sm text-muted-foreground">Meeting Minutes Agent</p>
            </div>
          </div>

          <Badge className="bg-lightGreen/30 text-foreground border-lightGreen/50">
            <span className="w-2 h-2 bg-lightGreen rounded-full mr-2 animate-pulse" />
            Active
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 slide-in">
          <Card className="p-5 border-glow-blue hover:border-glow-purple transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-blue/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center">
                <FileAudio className="w-6 h-6 text-blue" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Meetings</p>
                <p className="text-2xl font-bold text-blue">{stats.totalMeetings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-glow-purple hover:border-glow-pink transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-purple/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-purple" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Action Items</p>
                <p className="text-2xl font-bold text-purple">{stats.totalActionItems}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 border-glow-yellow hover:border-glow-green transition-all duration-300 hover:scale-105 bg-gradient-to-br from-background to-lightYellow/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-lightYellow/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-lightYellow" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-bold text-lightYellow">{stats.pendingActionItems}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 slide-in" style={{ animationDelay: "100ms" }}>
          <Button
            onClick={() => navigate("/alex/process-meeting")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-blue/20 to-purple/20 hover:from-blue/30 hover:to-purple/30 text-foreground border border-blue/30 hover:border-purple/30 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            <span className="text-sm">New Meeting</span>
          </Button>

          <Button
            onClick={() => navigate("/alex/history")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple/20 to-pink/20 hover:from-purple/30 hover:to-pink/30 text-foreground border border-purple/30 hover:border-pink/30 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <History className="w-5 h-5" />
            <span className="text-sm">History</span>
          </Button>

          <Button
            onClick={() => navigate("/alex/action-items")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-pink/20 to-lightYellow/20 hover:from-pink/30 hover:to-lightYellow/30 text-foreground border border-pink/30 hover:border-lightYellow/30 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <ListTodo className="w-5 h-5" />
            <span className="text-sm">Tasks</span>
          </Button>

          <Button
            onClick={() => navigate("/alex/settings")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-lightGreen/20 to-blue/20 hover:from-lightGreen/30 hover:to-blue/30 text-foreground border border-lightGreen/30 hover:border-blue/30 transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm">Settings</span>
          </Button>
        </div>

        {/* Recent Meetings */}
        <Card className="p-5 border-glow-pink hover:border-glow-blue transition-all duration-500 slide-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Recent Meetings
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/alex/history")}
              className="hover:border-primary hover:text-primary transition-all"
            >
              View All
            </Button>
          </div>

          <ScrollArea className="h-[280px]">
            <div className="space-y-3">
              {recentMeetings.map((meeting, index) => (
                <Card
                  key={meeting.id}
                  className={`p-4 cursor-pointer ${
                    index % 3 === 0 ? 'border-glow-blue' : index % 3 === 1 ? 'border-glow-purple' : 'border-glow-pink'
                  } hover:scale-102 transition-all duration-300 hover:shadow-lg`}
                  onClick={() => navigate(`/alex/meeting/${meeting.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm">{meeting.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meeting.date}
                        </span>
                        <span>{meeting.duration}</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {meeting.actionItems} actions
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-lightGreen/30 text-foreground text-xs">
                      Done
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
