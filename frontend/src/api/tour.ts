import { apiFetch } from "./client.ts";

export const getTour = async (id: number) =>
  apiFetch(`/api/tour/${id}`);

export const createTour = async (data: any) =>
  apiFetch(`/api/tour`, {
    method: "POST",
    body: JSON.stringify(data)
  });