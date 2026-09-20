export type PersistedActivity = {
  id: number;
  external_id: string;
  creator_external_id: string;
  creator_role: 'EDUCATOR' | 'EMPLOYER';
  title: string;
  description: string;
  category: string;
  final_xp: number;
  status: 'Draft' | 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
};

export type CreateActivityInput = {
  title: string;
  description: string;
  category: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/creation-api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function createActivity(input: CreateActivityInput) {
  return request<PersistedActivity>('/v1/activities', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function listActivities() {
  return request<PersistedActivity[]>('/v1/activities');
}
