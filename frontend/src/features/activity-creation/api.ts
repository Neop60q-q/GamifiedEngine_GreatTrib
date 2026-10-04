export type SkillAllocation = {
  skill_code: string;
  skill_name?: string;
  percentage: number;
  calculated_skill_xp?: number;
};
export type PersistedActivity = {
  id: number;
  external_id: string;
  creator_external_id: string;
  creator_role: "EDUCATOR" | "EMPLOYER";
  title: string;
  description: string;
  category: string;
  final_xp: number;
  minimum_level: number;
  repeatability: string;
  status: "Draft" | "Active" | "Inactive";
  created_at: string;
  updated_at: string;
  skill_allocations: SkillAllocation[];
};
export type CreateActivityInput = {
  title: string;
  description: string;
  category: string;
};
export type XPFactorsInput = {
  difficulty: string;
  estimated_time_value: number;
  estimated_time_unit: string;
  skill_level: string;
  effort: string;
  complexity: string;
  student_impact: string;
  verification_method: string;
  repeatability: string;
  completion_type: string;
};
export type PrototypeActivityInput = {
  creator_external_id: string;
  creator_role: "EDUCATOR" | "EMPLOYER";
  title: string;
  description: string;
  category: string;
  status: "Draft" | "Active" | "Inactive";
  factors: XPFactorsInput;
  skill_allocations: { skill_code: string; percentage: number }[];
  cosmetic_reward_code?: string | null;
  minimum_level: number;
};
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/creation-api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(
      (await response.text()) || `Request failed ${response.status}`,
    );
  }
  return response.json() as Promise<T>;
}
export function createActivity(input: CreateActivityInput) {
  return request<PersistedActivity>("/v1/activities", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function createPrototypeActivity(input: PrototypeActivityInput) {
  return request<PersistedActivity>("/v1/activities/prototype", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function previewActivityXp(factors: XPFactorsInput) {
  return request<{ calculated_xp: number; xp_rule_version: number }>(
    "/v1/activities/preview-xp",
    {
      method: "POST",
      body: JSON.stringify(factors),
    },
  );
}
export function listActivities() {
  return request<PersistedActivity[]>("/v1/activities");
}
export function listActiveActivities() {
  return request<PersistedActivity[]>("/v1/activities/active");
}
