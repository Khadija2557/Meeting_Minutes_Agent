import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
} from "lucide-react";
import alexAvatar from "@/assets/alex-avatar.png";

interface Meeting {
  id: string;
  title: string;
  date: string;
  status: "completed" | "pending";
  actionItems: number;
  summary: string;
  participants: string[];
}

export default function MeetingHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterParticipant, setFilterParticipant] = useState("all");

  const meetings: Meeting[] = [
    {
      id: "M_47",
      title: "Q4 Planning Meeting",
      date: "2025-01-15",
      status: "completed",
      actionItems: 5,
      summary: "Discussed Q4 goals, resource allocation, and timeline adjustments...",
      participants: ["John Doe", "Jane Smith", "Mike Johnson"],
    },
    {
      id: "M_46",
      title: "Product Review Session",
      date: "2025-01-12",
      status: "completed",
      actionItems: 3,
      summary: "Reviewed product features, user feedback, and upcoming releases...",
      participants: ["Jane Smith", "Sarah Williams"],
    },
    {
      id: "M_45",
      title: "Client Presentation",
      date: "2025-01-10",
      status: "completed",
      actionItems: 7,
      summary: "Presented project progress to client, discussed next steps...",
      participants: ["John Doe", "Mike Johnson", "Emily Davis"],
    },
    {
      id: "M_44",
      title: "Team Sync Meeting",
      date: "2025-01-08",
      status: "completed",
      actionItems: 4,
      summary: "Weekly team synchronization, blockers discussion...",
      participants: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams"],
    },
    {
      id: "M_43",
      title: "Budget Review",
      date: "2025-01-05",
      status: "completed",
      actionItems: 6,
      summary: "Reviewed Q1 budget allocation and approved expenditures...",
      participants: ["John Doe", "Emily Davis"],
    },
  ];

  const allParticipants = Array.from(
    new Set(meetings.flatMap((m) => m.participants))
  );

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || meeting.status === filterStatus;
    const matchesParticipant =
      filterParticipant === "all" || meeting.participants.includes(filterParticipant);

    return matchesSearch && matchesStatus && matchesParticipant;
  });

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
              <h1 className="text-2xl font-bold">Meeting History</h1>
              <p className="text-sm text-muted-foreground">
                View and search all processed meetings
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 border-glow-purple hover:border-glow-blue transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Participant Filter */}
            <Select value={filterParticipant} onValueChange={setFilterParticipant}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by participant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Participants</SelectItem>
                {allParticipants.map((participant) => (
                  <SelectItem key={participant} value={participant}>
                    {participant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Meetings Table */}
        <Card className="border-glow-pink hover:border-glow-yellow transition-all duration-500">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meeting Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Items</TableHead>
                  <TableHead>Summary Preview</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map((meeting, index) => (
                  <TableRow
                    key={meeting.id}
                    className="cursor-pointer hover:bg-accent/50"
                    onClick={() => navigate(`/alex/meeting/${meeting.id}`)}
                  >
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {meeting.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={meeting.status === "completed" ? "bg-lightGreen" : "bg-lightYellow"}>
                        {meeting.status === "completed" ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {meeting.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-blue/50">
                        {meeting.actionItems}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {meeting.summary}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/alex/meeting/${meeting.id}`);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        {filteredMeetings.length === 0 && (
          <Card className="p-12 text-center border-glow-blue">
            <p className="text-muted-foreground">No meetings found matching your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
