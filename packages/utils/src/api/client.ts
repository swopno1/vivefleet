// /packages/utils/src/api/client.ts
export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API error: ${res.status} - ${errText}`);
  }

  return res.json();
}
