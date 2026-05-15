import { apiFetch } from "./client";

export const createBlog = (data: any) =>
  apiFetch("/api/blog/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const addComment = (blogId: number, text: string) =>
  apiFetch(`/api/blog/${blogId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: text,
  });

export const editComment = (commentId: number, text: string) =>
  apiFetch(`/api/blog/comment/${commentId}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "text/plain" },
    body: text,
  });

export const likeBlog = (blogId: number) =>
  apiFetch(`/api/blog/${blogId}/like`, {
    method: "POST",
  });

export const getMyBlogs = () =>
  apiFetch("/api/blog/me");
