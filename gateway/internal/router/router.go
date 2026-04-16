package router

import (
	"net/http"

	"gateway/internal/config"
	"gateway/internal/middleware"
	"gateway/internal/proxy"
)

func New(cfg config.Config) http.Handler {

	publicMux := http.NewServeMux()
	protectedMux := http.NewServeMux()

	authProxy := proxy.New(cfg.Services["auth"])
	blogProxy := proxy.New(cfg.Services["blog"])
	userProxy := proxy.New(cfg.Services["stakeholders"])
	adminProxy := proxy.New(cfg.Services["stakeholders"])

	publicMux.HandleFunc("/api/auth/", authProxy)

	authMw := middleware.NewAuthMiddleware(cfg.JWTSecret)
	requireAdmin := middleware.RequireRole("ADMIN")

	protectedMux.Handle(
		"/api/blog/",
		authMw.Middleware(http.HandlerFunc(blogProxy)))
	protectedMux.Handle(
		"/api/user/",
		authMw.Middleware(http.HandlerFunc(userProxy)))
	protectedMux.Handle(
		"/api/admin/",
		authMw.Middleware(requireAdmin(http.HandlerFunc(adminProxy))))

	rootMux := http.NewServeMux()
	rootMux.Handle("/api/auth/", publicMux)
	rootMux.Handle("/", protectedMux)

	return rootMux
}
