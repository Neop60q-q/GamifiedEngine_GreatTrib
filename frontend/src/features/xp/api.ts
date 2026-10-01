export type CompletionResult = {
  status: string;

  activity_xp?: number;
  achievement_bonus_xp?: number;
  total_xp?: number;

  previous_level?: number;
  current_level?: number;
  level_up?: boolean;

  unlock_code?: string | null;
  unlock_name?: string | null;

  current_level_xp?: number;
  current_level_unlock_code?: string | null;
  current_level_unlock_name?: string | null;

  next_level?: number | null;
  next_level_xp?: number | null;
  next_level_unlock_code?: string | null;
  next_level_unlock_name?: string | null;

  xp_into_level?: number;
  xp_to_next_level?: number;
  level_progress_percent?: number;

  is_max_level?: boolean;

  skill_xp_awarded?: {
    skill_code: string;
    skill_name: string;
    xp_awarded: number;
  }[];

  achievements_unlocked?: unknown[];
  cosmetics_unlocked?: unknown[];
};
export type StudentProgress = {
  external_user_id: string;
  total_xp: number;

  previous_level: number;
  current_level: number;
  level_up: boolean;

  unlock_code: string | null;
  unlock_name: string | null;

  current_level_xp: number;
  current_level_unlock_code: string | null;
  current_level_unlock_name: string | null;

  next_level: number | null;
  next_level_xp: number | null;
  next_level_unlock_code: string | null;
  next_level_unlock_name: string | null;

  xp_into_level: number;
  xp_to_next_level: number;
  level_progress_percent: number;

  is_max_level: boolean;

  skills: {
    skill_code: string;
    skill_name: string;
    total_xp: number;
  }[];
};
async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`/xp-api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<T>;
}
export function completeActivity(
  externalActivityId: string,
  userId = "demo-student-1",
) {
  return req<CompletionResult>("/v1/completions/activity", {
    method: "POST",
    body: JSON.stringify({
      event_id: `web-${userId}-${externalActivityId}-${Date.now()}`,
      external_user_id: userId,
      external_activity_id: externalActivityId,
      approval_status: "APPROVED",
    }),
  });
}
export function getStudentProgress(userId = "demo-student-1") {
  return req<StudentProgress>(`/v1/students/${userId}/progress`);
}
