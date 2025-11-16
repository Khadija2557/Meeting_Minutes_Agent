<<<<<<< HEAD
import { useEffect, useState } from "react";
=======
import { useMemo, useState } from "react";
>>>>>>> f822a7453becd9388bb22308fd57ce764e062a2c
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
<<<<<<< HEAD
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Cell, LabelList, ResponsiveContainer } from "recharts";

function WeeklyCompletedBarChart() {
  // Example weekly completed items; in real app, source from data/store
  const baseData = [
    { key: "mon", name: "Mon", value: 5 },
    { key: "tue", name: "Tue", value: 7 },
    { key: "wed", name: "Wed", value: 4 },
    { key: "thu", name: "Thu", value: 9 },
    { key: "fri", name: "Fri", value: 6 },
    { key: "sat", name: "Sat", value: 3 },
    { key: "sun", name: "Sun", value: 2 },
  ];

  const [data, setData] = useState(
    baseData.map((d) => ({ ...d, animatedValue: 0 }))
  );

  // Smooth sequential animation: grow each bar from 0 to target, one-by-one
  useEffect(() => {
    let cancelled = false;

    const animateBar = (index: number, target: number, duration = 700) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelled) return;
          const t = Math.min(1, (now - start) / duration);
          // ease-out for smoother end
          const eased = 1 - Math.pow(1 - t, 4);
          const value = Math.round(target * eased);
          setData((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], animatedValue: value };
            return next;
          });
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(tick);
      });

    const run = async () => {
      for (let i = 0; i < baseData.length; i++) {
        await animateBar(i, baseData[i].value, 450);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  const pastel: Record<string, string> = {
    mon: "#93c5fd", // light blue
    tue: "#f8b4d9", // light pink
    wed: "#d8b4fe", // light purple
    thu: "#86efac", // light green
    fri: "#93c5fd",
    sat: "#f8b4d9",
    sun: "#d8b4fe",
  };

  return (
    <ResponsiveContainer width="100%" height={256}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }} barCategoryGap="18%" barGap={4}>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} padding={{ left: 20, right: 20 }} interval={0} />
      <YAxis tickLine={false} axisLine={false} tick={false} allowDecimals={false} domain={[0, "dataMax + 2"]} />
      <Bar dataKey="animatedValue" radius={[6, 6, 0, 0]} isAnimationActive={false}>
        {data.map((d) => (
          <Cell key={d.key} fill={pastel[d.key] || "#93c5fd"} />
        ))}
        <LabelList
          dataKey="animatedValue"
          position="top"
          formatter={(value: number) => (Number(value) > 0 ? value : "")}
          style={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        />
      </Bar>
    </BarChart>
    </ResponsiveContainer>
  );
}

function AlexHiGreeting() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);
  return (
    <div
      className={`flex items-center gap-3 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-blue/30 shadow-md bg-muted floating-animation">
        <img src={alexAvatar} alt="Alex waving" className="w-full h-full object-cover" />
      </div>
      <div className="relative px-3 py-2 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-none bg-white/90 backdrop-blur border border-border/50 shadow-sm text-sm md:text-base">
        <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 border border-border/50 rotate-45 shadow-sm"></span>
        <div>Hi! I'm Alex 👋</div>
        <div className="text-xs md:text-sm text-muted-foreground/80 mt-0.5">Your meeting minutes agent</div>
      </div>
    </div>
  );
}
=======
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import { runFollowupAgent } from "@/lib/api";
import type { FollowupResponse } from "@/types/api";
>>>>>>> f822a7453becd9388bb22308fd57ce764e062a2c

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
            <AlexHiGreeting />
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
            className="h-20 flex flex-col items-center justify-center gap-2 bg-white hover:bg-white text-foreground rounded-xl border border-glow-blue hover:border-glow-purple transition-transform duration-300 transform hover:scale-105 shadow-sm"
            size="lg"
            variant="default"
          >
            <Upload className="w-5 h-5 text-blue/70" />
            <span className="text-sm">New Meeting</span>
          </Button>

          <Button
            onClick={() => navigate("/alex/history")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-white hover:bg-white text-foreground rounded-xl border border-glow-purple hover:border-glow-pink transition-transform duration-300 transform hover:scale-105 shadow-sm"
            size="lg"
            variant="default"
          >
            <History className="w-5 h-5 text-purple/70" />
            <span className="text-sm">History</span>
          </Button>

          <Button
            onClick={() => navigate("/alex/action-items")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-white hover:bg-white text-foreground rounded-xl border border-glow-pink hover:border-glow-yellow transition-transform duration-300 transform hover:scale-105 shadow-sm"
            size="lg"
            variant="default"
          >
            <ListTodo className="w-5 h-5 text-pink/70" />
            <span className="text-sm">Tasks</span>
          </Button>

          <Button
            onClick={() => navigate("/alex/settings")}
            className="h-20 flex flex-col items-center justify-center gap-2 bg-white hover:bg-white text-foreground rounded-xl border border-glow-green hover:border-glow-blue transition-transform duration-300 transform hover:scale-105 shadow-sm"
            size="lg"
            variant="default"
          >
            <Settings className="w-5 h-5 text-lightGreen/70" />
            <span className="text-sm">Settings</span>
          </Button>
        </div>

<<<<<<< HEAD
        {/* Analytics + Recent Meetings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Analytics */}
          <Card className="p-5 border-glow-green transition-all duration-500 slide-in" style={{ animationDelay: "180ms" }}>
            <h2 className="text-lg font-semibold text-black mb-4">Weekly Completed Action Items</h2>
            <div className="grid grid-cols-1 gap-4 items-center">
              <div className="h-64 min-h-[256px] w-full">
                {/* Sequential animation via staged data values */}
                <WeeklyCompletedBarChart />
              </div>
            </div>
          </Card>

          {/* Recent Meetings */}
          <Card className="p-5 border-glow-pink hover:border-glow-blue transition-all duration-500 slide-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-black flex items-center gap-2">
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

=======
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
>>>>>>> f822a7453becd9388bb22308fd57ce764e062a2c
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
<<<<<<< HEAD
                            {meeting.date}
                          </span>
                          <span>{meeting.duration}</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {meeting.actionItems} actions
=======
                            {formatRecentDate(meeting.created_at)}
                          </span>
                          <span>{meeting.source_agent || "Unknown source"}</span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {meeting.action_items.length} actions
>>>>>>> f822a7453becd9388bb22308fd57ce764e062a2c
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-lightGreen/30 text-foreground text-xs">
<<<<<<< HEAD
                        Done
=======
                        {meeting.status}
>>>>>>> f822a7453becd9388bb22308fd57ce764e062a2c
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
<<<<<<< HEAD
          </Card>
        </div>
=======
          )}
        </Card>
>>>>>>> f822a7453becd9388bb22308fd57ce764e062a2c
      </div>
    </div>
  );
}
