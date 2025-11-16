import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Download,
  Edit,
  CheckCircle2,
  Clock,
  FileAudio,
  FileText,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import alexAvatar from "@/assets/alex-avatar.png";
import { fetchMeeting } from "@/lib/api";
import type { ActionItem, Meeting } from "@/types/api";

export default function MeetingDetails() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState("");
  const [localActionItems, setLocalActionItems] = useState<ActionItem[]>([]);

  const numericMeetingId = Number(meetingId);
  const isValidMeetingId = Number.isFinite(numericMeetingId);

  const {
    data: meeting,
    isLoading,
    isError,
    refetch,
  } = useQuery<Meeting | undefined>({
    queryKey: ["meeting", numericMeetingId],
    queryFn: () => fetchMeeting(numericMeetingId),
    enabled: isValidMeetingId,
  });

  useEffect(() => {
    if (meeting) {
      setSummaryDraft(meeting.summary ?? "");
      setLocalActionItems(meeting.action_items ?? []);
    }
  }, [meeting]);

  const toggleActionItemStatus = (id: number) => {
    setLocalActionItems((items) =>
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }
        const normalized = (item.status || "").toLowerCase();
        const nextStatus = ["completed", "done"].includes(normalized)
          ? "pending"
          : "completed";
        toast.success(`Action item marked as ${nextStatus}`);
        return { ...item, status: nextStatus };
      })
    );
  };

  const markAllAsDone = () => {
    if (!localActionItems.length) {
      toast.info("No action items to update");
      return;
    }
    setLocalActionItems((items) => items.map((item) => ({ ...item, status: "completed" })));
    toast.success("All action items marked as completed! 🎉");
  };

  const downloadSummary = () => {
    if (!meeting) {
      toast.error("Meeting data is not available yet");
      return;
    }
    const summaryContent = summaryDraft.trim() || meeting.summary?.trim();
    if (!summaryContent) {
      toast.error("Summary is not ready yet");
      return;
    }
    const blob = new Blob(
      [`Meeting: ${meeting.title} (ID ${meeting.id})\n\n${summaryContent}`],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meeting-${meeting.id}-summary.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Summary download started");
  };

  const copyToClipboard = async () => {
    const textToCopy = summaryDraft.trim() || meeting?.summary?.trim();
    if (!textToCopy) {
      toast.error("No summary available to copy");
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy summary");
    }
  };

  const formatDueDate = (value: string | null) => {
    if (!value) {
      return "No due date";
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
  };

  const titleText = meeting?.title ?? "Meeting";
  const subtitleText = meeting
    ? `Meeting Details - #${meeting.id}`
    : meetingId
    ? `Meeting Details - #${meetingId}`
    : "Meeting Details";

  const renderContent = () => {
    if (!isValidMeetingId) {
      return (
        <Card className="p-8 border-glow-blue">
          <p className="text-muted-foreground">Invalid meeting identifier provided.</p>
        </Card>
      );
    }

    if (isLoading) {
      return (
        <Card className="p-8 text-center border-glow-purple">
          <p className="text-muted-foreground">Loading meeting details...</p>
        </Card>
      );
    }

    if (isError) {
      return (
        <Card className="p-8 text-center space-y-4 border-glow-pink">
          <p className="text-muted-foreground">Unable to load meeting details right now.</p>
          <Button onClick={() => refetch()} className="mx-auto flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </Card>
      );
    }

    if (!meeting) {
      return (
        <Card className="p-8 border-glow-blue">
          <p className="text-muted-foreground">Meeting not found.</p>
        </Card>
      );
    }

    const createdAt = new Date(meeting.created_at).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

    return (
      <>
        <Card className="p-6 border-glow-blue hover:border-glow-purple transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <p className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {createdAt}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge className="capitalize">{meeting.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Source Agent</p>
              <p className="font-semibold">
                {meeting.source_agent || "Unknown"}
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid w-full grid-cols-3 border-glow-rainbow">
            <TabsTrigger value="summary" className="gap-2">
              <FileAudio className="w-4 h-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="transcript" className="gap-2">
              <FileText className="w-4 h-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="actions" className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Action Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card className="p-6 border-glow-green hover:border-glow-yellow transition-all duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileAudio className="w-5 h-5 text-primary" />
                  Meeting Summary
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingSummary(!isEditingSummary)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingSummary ? "Done" : "Edit"}
                </Button>
              </div>
              {isEditingSummary ? (
                <Textarea
                  value={summaryDraft}
                  onChange={(e) => setSummaryDraft(e.target.value)}
                  className="min-h-[200px]"
                />
              ) : (
                <ScrollArea className="h-[400px]">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {summaryDraft || meeting.summary || "Summary will appear here once processing completes."}
                  </p>
                </ScrollArea>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="transcript">
            <Card className="p-6 border-glow-pink hover:border-glow-blue transition-all duration-500">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Full Transcript
              </h3>
              <ScrollArea className="h-[400px]">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                  {meeting.transcript || "Transcript will appear here once available."}
                </pre>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="actions">
            <Card className="p-6 border-glow-purple hover:border-glow-pink transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Action Items ({localActionItems.length})
                </h3>
                <Button variant="outline" onClick={markAllAsDone} disabled={!localActionItems.length}>
                  Mark All as Done
                </Button>
              </div>
              {localActionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No action items generated for this meeting yet.</p>
              ) : (
                <div className="space-y-3">
                  {localActionItems.map((item, index) => {
                    const normalized = (item.status || "").toLowerCase();
                    const isCompleted = ["completed", "done"].includes(normalized);
                    return (
                      <Card
                        key={item.id}
                        className={`p-4 ${
                          index % 3 === 0
                            ? "border-glow-blue"
                            : index % 3 === 1
                            ? "border-glow-purple"
                            : "border-glow-pink"
                        } hover:scale-105 transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-medium mb-2 ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                              {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                              <span>Owner: {item.owner || "Unassigned"}</span>
                              <span>Due: {formatDueDate(item.due_date)}</span>
                            </div>
                          </div>
                          <Button
                            variant={isCompleted ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleActionItemStatus(item.id)}
                            className={isCompleted ? "bg-lightGreen" : "border-lightYellow/40"}
                          >
                            {isCompleted ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                Pending
                              </>
                            )}
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/alex/history")}
            className="hover:glow-cyan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              <img src={alexAvatar} alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{titleText}</h1>
              <p className="text-sm text-muted-foreground">{subtitleText}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadSummary} disabled={!meeting}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyToClipboard} disabled={!summaryDraft.trim() && !meeting?.summary}>
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              Copy Summary
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
