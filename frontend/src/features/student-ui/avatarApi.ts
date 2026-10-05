export type AvatarItem = {
  code: string;
  name: string;
  slot: string;
  asset_key: string;
  rarity: string;
};

export type EquippedAvatarItem = {
  code: string;
  name: string;
  asset_key: string;
};

export type AvatarState = {
  external_user_id: string;
  inventory: AvatarItem[];
  equipped: Record<string, EquippedAvatarItem>;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/avatar-api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

export function getAvatar(userId = "demo-student-1") {
  return request<AvatarState>(`/v1/avatar/${userId}`);
}

export function equipAvatarItem(itemCode: string, userId = "demo-student-1") {
  return request<AvatarState>("/v1/avatar/equip", {
    method: "POST",
    body: JSON.stringify({ external_user_id: userId, item_code: itemCode }),
  });
}
