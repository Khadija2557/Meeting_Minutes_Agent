import { useMemo, useState } from "react";
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
import { ArrowLeft, Search, Calendar, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import alexAvatar from "@/assets/alex-avatar.png";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import type { Meeting } from "@/types/api";

export default function MeetingHistory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  const {
    data: meetings,
    isLoading,
    isError,
    refetch,
  } = useMeetingsQuery();

  const meetingList: Meeting[] = meetings ?? [];

  const allSources = useMemo(
    () =>
      Array.from(
        new Set(meetingList.map((meeting) => meeting.source_agent || "Unknown"))
      ).sort(),
    [meetingList]
  );

  const filteredMeetings = useMemo(() => {
    const searchValue = searchQuery.trim().toLowerCase();
    return meetingList.filter((meeting) => {
      const summaryText = meeting.summary?.toLowerCase() ?? "";
      const matchesSearch =
        !searchValue ||
        meeting.title.toLowerCase().includes(searchValue) ||
        summaryText.includes(searchValue) ||
        `${meeting.id}`.includes(searchValue);
      const matchesStatus = filterStatus === "all" || meeting.status === filterStatus;
      const sourceValue = meeting.source_agent || "Unknown";
      const matchesSource = filterSource === "all" || sourceValue === filterSource;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [meetingList, searchQuery, filterStatus, filterSource]);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {allSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </Card>

        {/* Meetings Table */}
        <Card className="border-glow-pink hover:border-glow-yellow transition-all duration-500">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">Loading meetings...</div>
          ) : isError ? (
            <div className="p-12 text-center space-y-4">
              <p className="text-muted-foreground">Unable to load meetings. Please try again.</p>
              <Button onClick={() => refetch()} className="mx-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              No meetings found matching your filters.
            </div>
          ) : (
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
                  {filteredMeetings.map((meeting) => {
                    const isComplete = meeting.status === "done";
                    return (
                      <TableRow
                        key={meeting.id}
                        className="cursor-pointer hover:bg-accent/50"
                        onClick={() => navigate(`/alex/meeting/${meeting.id}`)}
                      >
                        <TableCell className="font-medium">{meeting.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDate(meeting.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={isComplete ? "bg-lightGreen" : "bg-lightYellow"}>
                            {isComplete ? (
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {meeting.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-blue/50">
                            {meeting.action_items.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {meeting.summary ?? "Processing..."}
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
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </Card>
      </div>
    </div>
  );
}
