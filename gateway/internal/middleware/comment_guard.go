package middleware

import (
	"fmt"
	"gateway/internal/client"
	"net/http"
	"strconv"
	"strings"
)

func CommentGuard(blogClient *client.BlogClient, followersClient *client.FollowersClient) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodPost || !strings.HasSuffix(r.URL.Path, "/comment") {
				next.ServeHTTP(w, r)
				return
			}

			// Path format: /api/blog/{blogId}/comment
			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
			if len(parts) < 3 {
				next.ServeHTTP(w, r)
				return
			}

			blogID := parts[2]
			userID := r.Header.Get("X-User-ID")
			role := r.Header.Get("X-Role")

			if userID == "" {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			blog, err := blogClient.GetBlog(userID, role, blogID)
			if err != nil {
				http.Error(w, fmt.Sprintf("Failed to fetch blog: %v", err), http.StatusBadGateway)
				return
			}

			authorID := strconv.Itoa(blog.AuthorID)

			// Users can always comment on their own blogs
			if authorID == userID {
				next.ServeHTTP(w, r)
				return
			}

			isFollowing, err := followersClient.IsFollowing(userID, authorID)
			if err != nil {
				http.Error(w, fmt.Sprintf("Failed to check follow status: %v", err), http.StatusBadGateway)
				return
			}

			if !isFollowing {
				http.Error(w, "You must follow the author to comment on this blog", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
