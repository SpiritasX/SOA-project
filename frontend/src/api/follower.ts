import { apiFetch } from "./client";

export const getFollowingStatus = (id: number) =>
  apiFetch(`/api/followers/${id}/status`);

export const follow = (id: number) =>
  apiFetch(`/api/followers/${id}/follow`, {
    method: "POST"
  });

export const unfollow = (id: number) =>
  apiFetch(`/api/followers/${id}/unfollow`, {
    method: "POST"
  });
