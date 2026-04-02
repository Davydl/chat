import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

export function getPulseApiUrl(): string {
  return `${getClientApiBaseUrl()}/api/pulses`;
}

export type Pulse = {
  id: string | null;
  account_id: string;
  active: boolean;
};

export type PulseResponse = {
  status: "success";
  pulses: Pulse[];
};

export type GetPulseParams = {
  accessToken: string;
};

export async function getPulse({
  accessToken,
}: GetPulseParams): Promise<PulseResponse> {
  const response = await fetch(getPulseApiUrl(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get pulse");
  }

  return response.json();
}
