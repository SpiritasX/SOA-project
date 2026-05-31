import { apiFetch } from "./client";

export const startTour = (tourId: number) =>
  apiFetch(`/api/gateway/tour/${tourId}/start`, {
    method: 'POST',
  });

export const abandonTour = (id: number) =>
  apiFetch(`/api/gateway/executions/${id}/abandon`, {
    method: 'POST',
  });

export const getActiveExecution = () =>
  apiFetch("/api/gateway/executions/active");

export const checkProximity = (id: number) =>
  apiFetch(`/api/gateway/executions/${id}/check-proximity`, {
    method: 'POST',
  });

export const updatePosition = (latitude: number, longitude: number) =>
  apiFetch("/api/tour/tourist/location", {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude, longitude }),
  });
