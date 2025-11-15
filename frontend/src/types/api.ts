export interface ActionItem {
  id: number;
  description: string;
  owner: string | null;
  due_date: string | null;
  status: string;
}

export interface Meeting {
  id: number;
  title: string;
  status: string;
  created_at: string;
  audio_url: string | null;
  transcript: string | null;
  summary: string | null;
  source_agent: string | null;
  action_items: ActionItem[];
}

export interface CreateMeetingResponse {
  meeting_id: number;
  status: string;
}

export interface FollowupResponse {
  summary: string;
  action_items: ActionItem[];
  metadata?: Record<string, unknown>;
}
