import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Users,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import alexAvatar from "@/assets/alex-avatar.png";

interface ActionItem {
  task: string;
  assignee: string;
  dueDate: string;
  status: "pending" | "completed";
}

interface MeetingData {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string[];
  summary: string;
  transcript: string;
  actionItems: ActionItem[];
}

export default function MeetingDetails() {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [copied, setCopied] = useState(false);

  const [meetingData, setMeetingData] = useState<MeetingData>({
    id: meetingId || "M_47",
    title: "Q4 Planning Meeting",
    date: "January 15, 2025",
    duration: "45 minutes",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    summary:
      "The team discussed Q4 goals, resource allocation, and timeline adjustments. Key decisions were made regarding project priorities and team structure. The focus will be on improving product quality and customer satisfaction.",
    transcript:
      "[00:00] John: Good morning everyone, let's start with our Q4 planning.\n[00:15] Jane: I've prepared the resource allocation spreadsheet.\n[00:45] Mike: We should prioritize the customer feedback items.\n[01:30] John: Agreed. Let's set some clear milestones...\n[02:00] Jane: I'll coordinate with the design team on the new features.\n[03:15] Mike: We need to allocate more resources to testing.\n[04:00] John: Great points everyone. Let's schedule a follow-up next week.",
    actionItems: [
      {
        task: "Finalize Q4 budget proposal",
        assignee: "John Doe",
        dueDate: "Jan 20, 2025",
        status: "pending",
      },
      {
        task: "Schedule follow-up with design team",
        assignee: "Jane Smith",
        dueDate: "Jan 18, 2025",
        status: "pending",
      },
      {
        task: "Review and update project timeline",
        assignee: "Mike Johnson",
        dueDate: "Jan 22, 2025",
        status: "pending",
      },
      {
        task: "Allocate additional testing resources",
        assignee: "Mike Johnson",
        dueDate: "Jan 25, 2025",
        status: "pending",
      },
      {
        task: "Prepare customer satisfaction metrics",
        assignee: "Jane Smith",
        dueDate: "Jan 19, 2025",
        status: "pending",
      },
    ],
  });

  const toggleActionItemStatus = (index: number) => {
    const updated = { ...meetingData };
    updated.actionItems[index].status =
      updated.actionItems[index].status === "pending" ? "completed" : "pending";
    setMeetingData(updated);
    toast.success(
      `Action item marked as ${updated.actionItems[index].status}`
    );
  };

  const markAllAsDone = () => {
    const updated = { ...meetingData };
    updated.actionItems = updated.actionItems.map((item) => ({
      ...item,
      status: "completed",
    }));
    setMeetingData(updated);
    toast.success("All action items marked as completed! 🎉");
  };

  const downloadSummary = () => {
    toast.success("Downloading meeting summary...");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetingData.summary);
    setCopied(true);
    toast.success("Summary copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
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
              <h1 className="text-2xl font-bold">{meetingData.title}</h1>
              <p className="text-sm text-muted-foreground">
                Meeting Details - {meetingData.id}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={downloadSummary}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyToClipboard}>
              {copied ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              Copy Summary
            </Button>
          </div>
        </div>

        {/* Meeting Info */}
        <Card className="p-6 border-glow-blue hover:border-glow-purple transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {meetingData.date}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-semibold">{meetingData.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Participants</p>
              <div className="flex flex-wrap gap-2">
                {meetingData.participants.map((participant) => (
                  <Badge key={participant} variant="secondary">
                    {participant}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
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

          {/* Summary Tab */}
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
                  {isEditingSummary ? "Save" : "Edit"}
                </Button>
              </div>
              {isEditingSummary ? (
                <Textarea
                  value={meetingData.summary}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, summary: e.target.value })
                  }
                  className="min-h-[200px]"
                />
              ) : (
                <ScrollArea className="h-[400px]">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {meetingData.summary}
                  </p>
                </ScrollArea>
              )}
            </Card>
          </TabsContent>

          {/* Transcript Tab */}
          <TabsContent value="transcript">
            <Card className="p-6 border-glow-pink hover:border-glow-blue transition-all duration-500">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Full Transcript
              </h3>
              <ScrollArea className="h-[400px]">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                  {meetingData.transcript}
                </pre>
              </ScrollArea>
            </Card>
          </TabsContent>

          {/* Action Items Tab */}
          <TabsContent value="actions">
            <Card className="p-6 border-glow-purple hover:border-glow-pink transition-all duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Action Items ({meetingData.actionItems.length})
                </h3>
                <Button variant="outline" onClick={markAllAsDone}>
                  Mark All as Done
                </Button>
              </div>
              <div className="space-y-3">
                {meetingData.actionItems.map((item, index) => (
                  <Card
                    key={index}
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
                        <p className={`font-medium mb-2 ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {item.task}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Assignee: {item.assignee}</span>
                          <span>Due: {item.dueDate}</span>
                        </div>
                      </div>
                      <Button
                        variant={item.status === "completed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleActionItemStatus(index)}
                        className={
                          item.status === "completed"
                            ? "bg-lightGreen"
                            : "border-lightYellow/40"
                        }
                      >
                        {item.status === "completed" ? (
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
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
