const API_URL = "http://localhost:8080";

export async function apiFetch(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token");

    return fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    });
}
