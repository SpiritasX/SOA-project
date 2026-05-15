import { apiFetch } from "./client";

export const getUser = () =>
  apiFetch('/api/user');

export const updateUser = (data: any) =>
  apiFetch('/api/user', {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const adminGetUser = (id: number) =>
  apiFetch(`/api/admin/users/${id}`);

export const getUsers = (page = 0, size = 5) =>
  apiFetch(`/api/admin/users?page=${page}&size=${size}`);

export const blockUser = (id: number) =>
  apiFetch(`/api/admin/users/${id}/block`, { method: "PATCH" });

export const unblockUser = (id: number) =>
  apiFetch(`/api/admin/users/${id}/unblock`, { method: "PATCH" });
