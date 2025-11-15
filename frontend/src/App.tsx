import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import AlexDashboard from "./pages/alex/AlexDashboard";
import ProcessMeeting from "./pages/alex/ProcessMeeting";
import MeetingHistory from "./pages/alex/MeetingHistory";
import MeetingDetails from "./pages/alex/MeetingDetails";
import ActionItems from "./pages/alex/ActionItems";
import Settings from "./pages/alex/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SupervisorDashboard />} />
          <Route path="/alex" element={<AlexDashboard />} />
          <Route path="/alex/process-meeting" element={<ProcessMeeting />} />
          <Route path="/alex/history" element={<MeetingHistory />} />
          <Route path="/alex/meeting/:meetingId" element={<MeetingDetails />} />
          <Route path="/alex/action-items" element={<ActionItems />} />
          <Route path="/alex/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
