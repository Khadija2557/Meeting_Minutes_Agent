import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import alexAvatar from "@/assets/alex-avatar.png";

interface ActionItem {
  id: string;
  task: string;
  assignedTo: string;
  dueDate: string;
  meetingId: string;
  meetingTitle: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
}

export default function ActionItems() {
  const navigate = useNavigate();
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDueDate, setFilterDueDate] = useState("all");

  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: "A1",
      task: "Finalize Q4 budget proposal",
      assignedTo: "John Doe",
      dueDate: "2025-01-20",
      meetingId: "M_47",
      meetingTitle: "Q4 Planning Meeting",
      status: "pending",
      priority: "high",
    },
    {
      id: "A2",
      task: "Schedule follow-up with design team",
      assignedTo: "Jane Smith",
      dueDate: "2025-01-18",
      meetingId: "M_47",
      meetingTitle: "Q4 Planning Meeting",
      status: "pending",
      priority: "medium",
    },
    {
      id: "A3",
      task: "Review and update project timeline",
      assignedTo: "Mike Johnson",
      dueDate: "2025-01-22",
      meetingId: "M_47",
      meetingTitle: "Q4 Planning Meeting",
      status: "pending",
      priority: "high",
    },
    {
      id: "A4",
      task: "Update product documentation",
      assignedTo: "Jane Smith",
      dueDate: "2025-01-19",
      meetingId: "M_46",
      meetingTitle: "Product Review Session",
      status: "completed",
      priority: "medium",
    },
    {
      id: "A5",
      task: "Send proposal to client",
      assignedTo: "John Doe",
      dueDate: "2025-01-16",
      meetingId: "M_45",
      meetingTitle: "Client Presentation",
      status: "completed",
      priority: "high",
    },
    {
      id: "A6",
      task: "Prepare demo for next meeting",
      assignedTo: "Mike Johnson",
      dueDate: "2025-01-25",
      meetingId: "M_45",
      meetingTitle: "Client Presentation",
      status: "pending",
      priority: "low",
    },
  ]);

  const allAssignees = Array.from(new Set(actionItems.map((item) => item.assignedTo)));

  const filteredItems = actionItems.filter((item) => {
    const matchesAssignee = filterAssignee === "all" || item.assignedTo === filterAssignee;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    let matchesDueDate = true;
    if (filterDueDate === "overdue") {
      matchesDueDate = new Date(item.dueDate) < new Date() && item.status === "pending";
    } else if (filterDueDate === "today") {
      matchesDueDate = item.dueDate === new Date().toISOString().split('T')[0];
    } else if (filterDueDate === "week") {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      matchesDueDate = new Date(item.dueDate) <= weekFromNow;
    }

    return matchesAssignee && matchesStatus && matchesDueDate;
  });

  const toggleStatus = (id: string) => {
    setActionItems(
      actionItems.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "pending" ? "completed" : "pending",
            }
          : item
      )
    );
    toast.success("Action item status updated!");
  };

  const stats = {
    total: actionItems.length,
    pending: actionItems.filter((i) => i.status === "pending").length,
    completed: actionItems.filter((i) => i.status === "completed").length,
    overdue: actionItems.filter(
      (i) => new Date(i.dueDate) < new Date() && i.status === "pending"
    ).length,
  };

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
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold">{stats.pending}</p>
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
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-glow-pink hover:border-glow-purple transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-pink/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-pink" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 border-glow-purple hover:border-glow-blue transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Assignee Filter */}
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {allAssignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Due Date Filter */}
            <Select value={filterDueDate} onValueChange={setFilterDueDate}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by due date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="today">Due Today</SelectItem>
                <SelectItem value="week">Due This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Action Items Table */}
        <Card className="border-glow-pink hover:border-glow-yellow transition-all duration-500">
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Meeting</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-accent/50">
                    <TableCell className={`font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      {item.task}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {item.assignedTo}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {item.dueDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.priority === "high"
                            ? "border-pink/50 text-pink"
                            : item.priority === "medium"
                            ? "border-lightYellow/50 text-lightYellow"
                            : "border-lightGreen/50 text-lightGreen"
                        }
                      >
                        {item.priority}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="cursor-pointer hover:underline"
                      onClick={() => navigate(`/alex/meeting/${item.meetingId}`)}
                    >
                      {item.meetingTitle}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={item.status === "completed" ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleStatus(item.id)}
                        className={
                          item.status === "completed"
                            ? "bg-lightGreen"
                            : "border-lightYellow/40"
                        }
                      >
                        {item.status === "completed" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Done
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Pending
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/alex/meeting/${item.meetingId}`)}
                      >
                        View Meeting
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>

        {filteredItems.length === 0 && (
          <Card className="p-12 text-center border-glow-blue">
            <p className="text-muted-foreground">No action items found matching your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
