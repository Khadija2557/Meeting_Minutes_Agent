import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Calendar,
  FileAudio,
  Users,
  Mic,
  Square,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import alexAvatar from "@/assets/alex-avatar.png";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

interface Participant {
  id: string;
  name: string;
  email: string;
}

const processingSteps = [
  { name: "Uploading audio...", icon: Upload, color: "text-blue" },
  { name: "Generating transcript...", icon: FileAudio, color: "text-purple" },
  { name: "Summarizing meeting...", icon: Loader2, color: "text-pink" },
  { name: "Extracting action items...", icon: Loader2, color: "text-lightGreen" },
];

export default function ProcessMeeting() {
  const navigate = useNavigate();
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "1", name: "", email: "" },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const {
    isRecording,
    audioBlob,
    recordingTime,
    startRecording,
    stopRecording,
    resetRecording,
  } = useAudioRecorder();

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now().toString(), name: "", email: "" },
    ]);
  };

  const removeParticipant = (id: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const updateParticipant = (id: string, field: "name" | "email", value: string) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const isFormValid = () => {
    return (
      meetingTitle.trim() !== "" &&
      meetingDate !== "" &&
      (audioFile !== null || audioBlob !== null) &&
      participants.every((p) => p.name.trim() !== "" && p.email.trim() !== "" && p.email.includes("@"))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/m4a", "audio/webm"];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|webm)$/i)) {
        toast.error("Invalid file type. Please upload MP3, WAV, M4A, or WebM files.");
        return;
      }
      setAudioFile(file);
      resetRecording();
      toast.success(`File "${file.name}" uploaded successfully!`);
    }
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
      setAudioFile(null);
      toast.success("Recording started!");
    } catch (error) {
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    toast.success("Recording stopped!");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const processMeeting = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setCurrentStepIndex(0);

    const steps = [
      { duration: 1000 },
      { duration: 2000 },
      { duration: 1500 },
      { duration: 1500 },
    ];

    let currentProgress = 0;
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
      currentProgress += 25;
      setProgress(currentProgress);
    }

    toast.success("Meeting processed successfully! 🎉");
    setTimeout(() => {
      navigate("/alex/meeting/M_48");
    }, 500);
  };

  const resetForm = () => {
    setMeetingTitle("");
    setMeetingDate("");
    setAudioFile(null);
    resetRecording();
    setParticipants([{ id: "1", name: "", email: "" }]);
    toast.info("Form reset");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/alex")}
            className="hover:glow-cyan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              <img src={alexAvatar} alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Process New Meeting</h1>
              <p className="text-sm text-muted-foreground">Upload and process meeting audio</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card className="p-8 border-glow-purple hover:border-glow-blue transition-all duration-500">
          <div className="space-y-6">
            {/* Meeting Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Meeting Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Q4 Planning Meeting"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="border-glow-blue focus:border-glow-purple"
              />
            </div>

            {/* Meeting Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Meeting Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="border-glow-pink focus:border-glow-yellow"
              />
            </div>

            {/* Audio File Upload */}
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileAudio className="w-4 h-4" />
                Upload Audio File *
              </Label>
              <Card className="p-6 border-dashed border-2 border-glow-green hover:border-glow-blue transition-all duration-500">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-lightGreen/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-lightGreen" />
                  </div>
                  <div>
                    <p className="font-medium mb-2">
                      {audioFile ? audioFile.name : "Drop your audio file here or click to browse"}
                    </p>
                    <Input
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a"
                      onChange={handleFileChange}
                      className="hidden"
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload">
                      <Button className="cursor-pointer" asChild>
                        <span>Select Audio File</span>
                      </Button>
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP3, WAV, M4A (Max 100MB)
                  </p>
                </div>
              </Card>
            </div>

            {/* Participants */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants *
              </Label>
              {participants.map((participant, index) => (
                <Card
                  key={participant.id}
                  className={`p-4 ${
                    index % 3 === 0 ? 'border-glow-blue' : index % 3 === 1 ? 'border-glow-purple' : 'border-glow-pink'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`name-${participant.id}`} className="text-xs mb-1">
                          Name
                        </Label>
                        <Input
                          id={`name-${participant.id}`}
                          placeholder="John Doe"
                          value={participant.name}
                          onChange={(e) =>
                            updateParticipant(participant.id, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`email-${participant.id}`} className="text-xs mb-1">
                          Email
                        </Label>
                        <Input
                          id={`email-${participant.id}`}
                          type="email"
                          placeholder="john@example.com"
                          value={participant.email}
                          onChange={(e) =>
                            updateParticipant(participant.id, "email", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(participant.id)}
                      disabled={participants.length === 1}
                      className="mt-6"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={addParticipant}
                className="w-full border-glow-green hover:border-glow-yellow"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Participant
              </Button>
            </div>
          </div>
        </Card>

        {/* Processing Progress */}
        {isProcessing && (
          <Card className="p-6 animate-fade-in bg-card/80 backdrop-blur-sm border-glow-blue">
            <div className="space-y-6">
              {/* Steps Indicator */}
              <div className="grid grid-cols-4 gap-2">
                {processingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStepIndex;
                  const isDone = index < currentStepIndex;
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isDone
                            ? 'bg-lightGreen/20 border-2 border-lightGreen'
                            : isActive
                            ? 'bg-gradient-to-br from-blue/20 to-purple/20 border-2 border-purple animate-pulse'
                            : 'bg-muted border-2 border-border'
                        }`}
                      >
                        <StepIcon className={`w-5 h-5 ${
                          isDone ? 'text-lightGreen' : isActive ? step.color : 'text-muted-foreground'
                        } ${isActive && step.icon === Loader2 ? 'animate-spin' : ''}`} />
                      </div>
                      <span className={`text-xs text-center ${
                        isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {step.name.replace('...', '')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden animate-pulse">
                      <img src={alexAvatar} alt="Alex" className="w-full h-full" />
                    </div>
                    <span className="text-muted-foreground">{processingSteps[currentStepIndex].name}</span>
                  </div>
                  <span className="font-bold text-primary">{progress}%</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={processMeeting}
            disabled={!isFormValid() || isProcessing}
            className="flex-1 h-12 text-base"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Process Meeting"}
          </Button>
          <Button
            variant="outline"
            onClick={resetForm}
            disabled={isProcessing}
            className="h-12"
          >
            Reset Form
          </Button>
        </div>
      </div>
    </div>
  );
}
