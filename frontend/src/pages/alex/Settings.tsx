import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Moon,
  Sun,
  Users,
  Trash2,
  Plus,
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import alexAvatar from "@/assets/meeting-followup-agent.png";

interface SavedParticipant {
  id: string;
  name: string;
  email: string;
}

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [savedParticipants, setSavedParticipants] = useState<SavedParticipant[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Mike Johnson", email: "mike@example.com" },
  ]);
  const [newParticipant, setNewParticipant] = useState({ name: "", email: "" });

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else if (stored === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const applyTheme = (enableDark: boolean) => {
    const root = document.documentElement;
    if (enableDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    applyTheme(next);
    toast.info(`Dark mode ${next ? "enabled" : "disabled"}`);
  };

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email.includes("@")) {
      setSavedParticipants([
        ...savedParticipants,
        {
          id: Date.now().toString(),
          name: newParticipant.name,
          email: newParticipant.email,
        },
      ]);
      setNewParticipant({ name: "", email: "" });
      toast.success("Participant added!");
    } else {
      toast.error("Please enter valid name and email");
    }
  };

  const removeParticipant = (id: string) => {
    setSavedParticipants(savedParticipants.filter((p) => p.id !== id));
    toast.success("Participant removed");
  };

  const clearHistory = () => {
    toast.info("Meeting history cleared (UI only)");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/alex/dashboard")}
            className="hover:glow-cyan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
              <img src={alexAvatar} alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">
                Manage your Alex agent preferences
              </p>
            </div>
          </div>

          <Badge className="bg-lightGreen text-foreground">
            <SettingsIcon className="w-3 h-3 mr-2" />
            Configuration
          </Badge>
        </div>

        {/* Dark/Light Mode */}
        <Card className="p-6 border-glow-purple hover:border-glow-blue transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {darkMode ? (
                <Moon className="w-8 h-8 text-purple" />
              ) : (
                <Sun className="w-8 h-8 text-lightYellow" />
              )}
              <div>
                <h3 className="text-lg font-semibold">Theme Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </Card>

        {/* Saved Participants */}
        <Card className="p-6 border-glow-pink hover:border-glow-yellow transition-all duration-500">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Saved Participants</h3>
            </div>

            {/* Add New Participant */}
            <Card className="p-4 border-glow-green">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Add New Participant</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={newParticipant.name}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, name: e.target.value })
                    }
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newParticipant.email}
                    onChange={(e) =>
                      setNewParticipant({ ...newParticipant, email: e.target.value })
                    }
                  />
                </div>
                <Button
                  onClick={addParticipant}
                  className="w-full"
                  disabled={!newParticipant.name || !newParticipant.email}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Participant
                </Button>
              </div>
            </Card>

            {/* Participant List */}
            <div className="space-y-2">
              {savedParticipants.map((participant, index) => (
                <Card
                  key={participant.id}
                  className={`p-4 ${
                    index % 3 === 0
                      ? "border-glow-blue"
                      : index % 3 === 1
                      ? "border-glow-purple"
                      : "border-glow-pink"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>

        {/* Clear History */}
        <Card className="p-6 border-glow-blue hover:border-glow-purple transition-all duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-pink/20 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-pink" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Clear Meeting History</h3>
                <p className="text-sm text-muted-foreground">
                  Remove all processed meetings and action items (UI only)
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={clearHistory}>
              Clear History
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="p-6 bg-gradient-to-br from-blue/10 to-purple/10 border-glow-rainbow">
          <p className="text-sm text-muted-foreground text-center">
            These settings are for UI demonstration purposes. In a production environment,
            these would be persisted to a database and affect actual application behavior.
          </p>
        </Card>
      </div>
    </div>
  );
}
