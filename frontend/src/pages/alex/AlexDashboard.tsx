import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import alexAvatar from "@/assets/alex-avatar.png";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import { runFollowupAgent } from "@/lib/api";
import type { FollowupResponse } from "@/types/api";

export default function AlexDashboard() {
  const navigate = useNavigate();
  const [followupTranscript, setFollowupTranscript] = useState("");
  const [followupResult, setFollowupResult] = useState<FollowupResponse | null>(null);

  const { data: meetings, isLoading, isError, refetch } = useMeetingsQuery();
  const meetingList = meetings ?? [];

  const stats = useMemo(() => {
    const totalMeetings = meetingList.length;
    const allActionItems = meetingList.flatMap((meeting) => meeting.action_items);
    const totalActionItems = allActionItems.length;
    const pendingActionItems = allActionItems.filter((item) => {
      const normalized = (item.status || "").toLowerCase();
      return !["done", "completed"].includes(normalized);
    }).length;
    return { totalMeetings, totalActionItems, pendingActionItems };
  }, [meetingList]);

  const recentMeetings = meetingList.slice(0, 3);
  const formatRecentDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const followupMutation = useMutation({
    mutationFn: ({ transcript }: { transcript: string }) =>
      runFollowupAgent({ transcript, metadata: { source: "alex-dashboard" } }),
    onSuccess: (data) => {
      setFollowupResult(data);
      toast.success("Follow-up generated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate follow-up");
    },
  });

  const handleFollowup = () => {
    const trimmed = followupTranscript.trim();
    if (!trimmed) {
      toast.error("Please provide a transcript for Alex to analyze");
      return;
    }
    followupMutation.mutate({ transcript: trimmed });
  };

  const clearFollowup = () => {
    setFollowupTranscript("");
    setFollowupResult(null);
  };

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
                <p className="text-2xl font-bold text-blue">
                  {isLoading ? "--" : stats.totalMeetings}
                </p>
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
                <p className="text-2xl font-bold text-purple">
                  {isLoading ? "--" : stats.totalActionItems}
                </p>
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
                <p className="text-2xl font-bold text-lightYellow">
                  {isLoading ? "--" : stats.pendingActionItems}
                </p>
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

        <Card className="p-5 border-glow-green hover:border-glow-blue transition-all duration-500 slide-in" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Instant Follow-up</h2>
              <p className="text-sm text-muted-foreground">Paste a transcript and let Alex summarize it without saving to history.</p>
            </div>
          </div>
          <Textarea
            placeholder="Paste transcript text here..."
            value={followupTranscript}
            onChange={(e) => setFollowupTranscript(e.target.value)}
            className="min-h-[140px]"
          />
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              onClick={handleFollowup}
              disabled={followupMutation.isPending || !followupTranscript.trim()}
              className="flex items-center gap-2"
            >
              {followupMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={clearFollowup}
              disabled={!followupTranscript && !followupResult}
            >
              Clear
            </Button>
          </div>
          {followupResult && (
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{followupResult.summary}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Action Items</h3>
                {followupResult.action_items.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No action items detected.</p>
                ) : (
                  <div className="space-y-2">
                    {followupResult.action_items.map((item, idx) => (
                      <Card key={`${item.description}-${idx}`} className="p-3 border-glow-purple">
                        <p className="font-medium text-sm">{item.description}</p>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-3 mt-1">
                          {item.owner && <span>Owner: {item.owner}</span>}
                          {item.due_date && <span>Due: {item.due_date}</span>}
                          <span>Status: {item.status}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>

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

          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">Loading meetings...</div>
          ) : isError ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-muted-foreground">Unable to load recent meetings.</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mx-auto flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          ) : recentMeetings.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No meetings processed yet.</div>
          ) : (
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
                            {formatRecentDate(meeting.created_at)}
                          </span>
                          <span>{meeting.source_agent || "Unknown source"}</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {meeting.action_items.length} actions
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-lightGreen/30 text-foreground text-xs">
                        {meeting.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
}
