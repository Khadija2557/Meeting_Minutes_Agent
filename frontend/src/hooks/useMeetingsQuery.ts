import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { fetchMeetings } from "@/lib/api";
import type { Meeting } from "@/types/api";

export const MEETINGS_QUERY_KEY = ["meetings"] as const;

export function useMeetingsQuery(): UseQueryResult<Meeting[]> {
  return useQuery({
    queryKey: MEETINGS_QUERY_KEY,
    queryFn: () => fetchMeetings(),
    staleTime: 30_000,
  });
}
