import { apiFetch } from "./client.ts";

export const getTour = async (id: number) =>
  apiFetch(`/api/tour/${id}`);

export const createTour = async (data: any) =>
  apiFetch(`/api/tour`, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const getTourLocations = async (tourId: number) =>
  apiFetch(`/api/tour/${tourId}/locations`);

export const createTourLocation = async (tourId: number, data: any) =>
  apiFetch(`/api/tour/${tourId}/locations`, {
    method: "POST",
    body: JSON.stringify(data)
  });

export const editTourLocation = async (tourId: number, locId:number, data: any) =>
  apiFetch(`/api/tour/${tourId}/locations/${locId}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });

export const deleteTourLocation = async (tourId: number, locationId: number) =>
  apiFetch(`/api/tour/${tourId}/locations/${locationId}`, {
    method: "DELETE"
  });

export const getMyTours = async () =>
  apiFetch(`/api/tour/me`);
