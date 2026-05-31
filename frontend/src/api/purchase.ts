import { apiFetch } from "./client.ts";

export const getMyPurchases = async () =>
  apiFetch(`/api/gateway/purchases`);

export const purchase = async (tourIds: number[]) =>
  apiFetch(`/api/purchase`, {
    method: "POST",
    body: JSON.stringify(tourIds),
  });
