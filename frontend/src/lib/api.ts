import type { CreateMeetingResponse, FollowupResponse, Meeting } from "@/types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: init?.body instanceof FormData
      ? init.headers
      : {
          ...(init?.headers || {}),
        },
  });

  const text = await response.text();
  let data: unknown = undefined;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      if (response.ok) {
        throw new Error("Failed to parse server response");
      }
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data
        ? String((data as Record<string, unknown>).error)
        : response.statusText;
    throw new Error(message || "Request failed");
  }

  return data as T;
}

export function fetchMeetings(limit?: number) {
  const query = typeof limit === "number" ? `?limit=${limit}` : "";
  return request<Meeting[]>(`/meetings${query}`);
}

export function fetchMeeting(meetingId: number | string) {
  return request<Meeting>(`/meetings/${meetingId}`);
}

export function createMeeting(formData: FormData) {
  return request<CreateMeetingResponse>(`/meetings`, {
    method: "POST",
    body: formData,
  });
}

export function runFollowupAgent(payload: {
  transcript: string;
  metadata?: Record<string, unknown>;
}) {
  return request<FollowupResponse>(`/agents/meeting-followup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
