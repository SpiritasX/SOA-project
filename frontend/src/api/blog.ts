import { apiFetch } from "./client";

export const getBlog = (id: string | undefined) =>
  apiFetch(`/api/blog/${id}`);

export const createBlog = (data: any) =>
  apiFetch("/api/blog/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const addComment = (blogId: string | undefined, text: string) =>
  apiFetch(`/api/blog/${blogId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: text,
  });

export const editComment = (blogId: string | undefined, commentId: number, text: string) =>
  apiFetch(`/api/blog/${blogId}/comment/${commentId}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "text/plain" },
    body: text,
  });

export const likeBlog = (blogId: string | undefined) =>
  apiFetch(`/api/blog/${blogId}/like`, {
    method: "POST",
  });

export const getMyBlogs = () =>
  apiFetch("/api/blog/me");

export const getFeed = () =>
  apiFetch("/api/gateway/feed");
