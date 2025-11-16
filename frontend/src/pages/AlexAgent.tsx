import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Upload,
  FileAudio,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Star,
  MessageSquare,
  History,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import alexAvatar from "@/assets/meeting-followup-agent.png";

export default function AlexAgent() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTab, setCurrentTab] = useState("upload");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setProgress(0);
      toast.success(`Processing ${file.name}...`);

      // Simulate processing
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setCurrentTab("summary");
            toast.success("Meeting summary ready! 🎉");
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  const mockMeetings = [
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

  const mockSummary = {
    title: "Q4 Planning Meeting",
    date: "January 15, 2025",
    duration: "45 minutes",
    participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    summary:
      "The team discussed Q4 goals, resource allocation, and timeline adjustments. Key decisions were made regarding project priorities and team structure.",
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
    ],
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="hover:glow-cyan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted floating-animation">
              <img src={alexAvatar} alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Alex</h1>
              <p className="text-muted-foreground">Meeting Follow-up Agent</p>
            </div>
          </div>

          <Badge className="bg-green-500 text-white">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
            Active
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 border-glow-rainbow">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-2">
              <FileAudio className="w-4 h-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="p-8 border-dashed border-2 border-glow-purple hover:border-glow-pink transition-all duration-500">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-purple/10 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Upload Meeting Audio
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Drop your audio file here or click to browse
                  </p>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button className="cursor-pointer" asChild>
                      <span>Select Audio File</span>
                    </Button>
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported formats: MP3, WAV, M4A (Max 100MB)
                </p>
              </div>
            </Card>

            {isProcessing && (
              <Card className="p-6 animate-scale-in bg-card/80 backdrop-blur-sm border-glow-blue">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden animate-pulse">
                      <img src={alexAvatar} alt="Alex" className="w-full h-full" />
                    </div>
                    <p className="text-lg">
                      I'm analyzing your meeting... give me a sec 😺
                    </p>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Processing audio...</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <Card className="p-6 animate-scale-in bg-card/80 backdrop-blur-sm border-glow-green hover:border-glow-yellow transition-all duration-500">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {mockSummary.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {mockSummary.date}
                    </span>
                    <span>{mockSummary.duration}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button size="sm">
                    <Star className="w-4 h-4 mr-2" />
                    Rate
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileAudio className="w-5 h-5 text-primary" />
                    Meeting Summary
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {mockSummary.summary}
                  </p>
                </div>

                {/* Participants */}
                <div>
                  <h3 className="font-semibold mb-3">Participants</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockSummary.participants.map((participant) => (
                      <Badge key={participant} variant="secondary">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Action Items
                  </h3>
                  <div className="space-y-3">
                    {mockSummary.actionItems.map((item, index) => (
                      <Card
                        key={index}
                        className={`p-4 bg-card/80 backdrop-blur-sm ${
                          index % 3 === 0 ? 'border-glow-pink' : index % 3 === 1 ? 'border-glow-blue' : 'border-glow-purple'
                        } hover:scale-105 transition-all duration-300`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium mb-2">{item.task}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Assignee: {item.assignee}</span>
                              <span>Due: {item.dueDate}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-lightYellow border-lightYellow/40">
                            Pending
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-4">
              {mockMeetings.map((meeting, index) => (
                <Card
                  key={meeting.id}
                  className={`p-6 bg-card/80 backdrop-blur-sm ${
                    index % 3 === 0 ? 'border-glow-purple' : index % 3 === 1 ? 'border-glow-blue' : 'border-glow-pink'
                  } hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setCurrentTab("summary")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{meeting.date}</span>
                        <span>{meeting.duration}</span>
                        <span>{meeting.actionItems} action items</span>
                      </div>
                    </div>
                    <Badge className="bg-lightGreen">Completed</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="p-6 h-[500px] flex flex-col bg-card/80 backdrop-blur-sm border-glow-pink hover:border-glow-blue transition-all duration-500">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={alexAvatar} alt="Alex" className="w-full h-full" />
                </div>
                <div>
                  <p className="font-semibold">Chat with Alex</p>
                  <p className="text-sm text-muted-foreground">
                    Ask me about any meeting
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img src={alexAvatar} alt="Alex" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                      <p className="text-sm">
                        Hi! I'm Alex 😺 I can help you with meeting summaries,
                        action items, or answer questions about past meetings.
                        What would you like to know?
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask Alex about meetings..."
                  className="flex-1"
                />
                <Button>Send</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
