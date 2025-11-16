import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  CheckCircle2,
  Clock,
  ListTodo,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import meetingFollowupAvatar from "@/assets/meeting-followup-agent.png";
import { useMeetingsQuery } from "@/hooks/useMeetingsQuery";
import type { ActionItem as BackendActionItem } from "@/types/api";

interface EnrichedActionItem extends BackendActionItem {
  meetingId: number;
  meetingTitle: string;
}

export default function ActionItems() {
  const navigate = useNavigate();
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("all");

  const { data: meetings, isLoading, isError, refetch } = useMeetingsQuery();
  const [items, setItems] = useState<EnrichedActionItem[]>([]);

  useEffect(() => {
    if (meetings) {
      const flattened: EnrichedActionItem[] = meetings.flatMap((meeting) =>
        meeting.action_items.map((item) => ({
          ...item,
          meetingId: meeting.id,
          meetingTitle: meeting.title,
        }))
      );
      setItems(flattened);
    }
  }, [meetings]);

  const isActionItemDone = (status: string) =>
    ["completed", "done"].includes((status || "").toLowerCase());

  const formatDueDate = (value: string | null) => {
    if (!value) return "No due date";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
  };

  const allAssignees = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((item) => item.owner)
            .filter((owner): owner is string => Boolean(owner && owner.trim()))
        )
      ),
    [items]
  );

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => isActionItemDone(item.status)).length;
    const pending = total - completed;
    const overdue = items.filter((item) => {
      if (!item.due_date || isActionItemDone(item.status)) {
        return false;
      }
      const dueDate = new Date(item.due_date);
      return !Number.isNaN(dueDate.getTime()) && dueDate < new Date();
    }).length;
    return { total, pending, completed, overdue };
  }, [items]);

  const filteredItems = useMemo(() => {
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0];
    return items.filter((item) => {
      const matchesAssignee = filterAssignee === "all" || item.owner === filterAssignee;
      const done = isActionItemDone(item.status);
      const matchesStatus =
        filterStatus === "all" || (filterStatus === "completed" ? done : !done);

      let matchesDueDate = true;
      if (filterDueDate === "overdue") {
        matchesDueDate =
          item.due_date && !done ? new Date(item.due_date) < today : false;
      } else if (filterDueDate === "today") {
        matchesDueDate = item.due_date ? item.due_date.startsWith(todayKey) : false;
      } else if (filterDueDate === "week") {
        if (item.due_date) {
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          matchesDueDate = new Date(item.due_date) <= weekFromNow;
        } else {
          matchesDueDate = false;
        }
      }

      return matchesAssignee && matchesStatus && matchesDueDate;
    });
  }, [items, filterAssignee, filterStatus, filterDueDate]);

  const toggleStatus = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: isActionItemDone(item.status) ? "pending" : "completed" }
          : item
      )
    );
    toast.success("Action item status updated!");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
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
              <img src={meetingFollowupAvatar} alt="Alex" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Action Items</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage all tasks from meetings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-glow-blue hover:border-glow-purple transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue/20 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-blue" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{isLoading ? "--" : stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-glow-yellow hover:border-glow-green transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lightYellow/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-lightYellow" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-lightYellow">
                  {isLoading ? "--" : stats.pending}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-glow-green hover:border-glow-blue transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lightGreen/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-lightGreen" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-lightGreen">
                  {isLoading ? "--" : stats.completed}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-glow-pink hover:border-glow-yellow transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-pink" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-pink">
                  {isLoading ? "--" : stats.overdue}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 border-glow-purple hover:border-glow-blue transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Assignee
              </label>
              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {allAssignees.map((assignee) => (
                    <SelectItem key={assignee} value={assignee}>
                      {assignee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Due Date</label>
              <Select value={filterDueDate} onValueChange={setFilterDueDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="today">Due Today</SelectItem>
                  <SelectItem value="week">Due in 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Data</label>
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
          </div>
        </Card>

        {/* Action Items Table */}
        <Card className="border-glow-pink hover:border-glow-yellow transition-all duration-500">
          {isLoading ? (
            <div className="p-10 text-center text-muted-foreground">Loading action items...</div>
          ) : isError ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-muted-foreground">Unable to load action items.</p>
              <Button onClick={() => refetch()} className="mx-auto flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              No action items match your filters.
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const done = isActionItemDone(item.status);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>{item.owner || "Unassigned"}</TableCell>
                        <TableCell>{formatDueDate(item.due_date)}</TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            className="p-0"
                            onClick={() => navigate(`/alex/meeting/${item.meetingId}`)}
                          >
                            {item.meetingTitle}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Badge className={done ? "bg-lightGreen" : "bg-lightYellow"}>
                            {done ? "Completed" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={done ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleStatus(item.id)}
                          >
                            {done ? "Mark Pending" : "Mark Done"}
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
