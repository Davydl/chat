import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

import { PulseResponse } from "./getPulse";

export type UpdatePulseParams = {
  accessToken: string;
  active: boolean;
};

export async function updatePulse({
  accessToken,
  active,
}: UpdatePulseParams): Promise<PulseResponse> {
  const response = await fetch(`${getClientApiBaseUrl()}/api/pulses`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ active }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update pulse");
  }

  return response.json();
}
