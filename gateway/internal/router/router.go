package router

import (
	"net/http"
	"time"

	"gateway/internal/aggregate"
	"gateway/internal/client"
	"gateway/internal/config"
	"gateway/internal/handler"
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
	followersProxy := proxy.New(cfg.Services["followers"])
	tourProxy := proxy.New(cfg.Services["tour"])
	purchaseProxy := proxy.New(cfg.Services["purchase"])

	httpClient := &http.Client{
		Timeout: 30 * time.Second,
	}

	followersClient := client.NewFollowersClient(cfg.Services["followers"], httpClient)
	usersClient := client.NewUsersClient(cfg.Services["stakeholders"], httpClient)
	blogClient := client.NewBlogClient(cfg.Services["blog"], httpClient)
	tourClient := client.NewTourClient(cfg.Services["tour"], httpClient)
	purchaseClient := client.NewPurchaseClient(cfg.Services["purchase"], httpClient)

	recommendationService := aggregate.NewRecommendationService(followersClient, usersClient)
	feedService := aggregate.NewFeedService(followersClient, blogClient)
	purchaseService := aggregate.NewPurchaseService(purchaseClient, tourClient)

	gatewayHandler := handler.NewGatewayHandler(recommendationService, feedService, purchaseService)

	commentGuard := middleware.CommentGuard(blogClient, followersClient)

	publicMux.HandleFunc("/api/auth/", authProxy)
	publicMux.HandleFunc("/api/auth", authProxy)

	authMw := middleware.NewAuthMiddleware(cfg.JWTSecret)
	requireAdmin := middleware.RequireRole("ADMINISTRATOR")

	protectedMux.Handle("/api/blog/", authMw.Middleware(commentGuard(blogProxy)))
	protectedMux.Handle("/api/blog", authMw.Middleware(blogProxy))

	protectedMux.Handle("/api/user/", authMw.Middleware(userProxy))
	protectedMux.Handle("/api/user", authMw.Middleware(userProxy))

	protectedMux.Handle("/api/followers/", authMw.Middleware(followersProxy))
	protectedMux.Handle("/api/followers", authMw.Middleware(followersProxy))

	protectedMux.Handle("/api/tour/", authMw.Middleware(tourProxy))
	protectedMux.Handle("/api/tour", authMw.Middleware(tourProxy))

	protectedMux.Handle("/api/purchase/", authMw.Middleware(purchaseProxy))
	protectedMux.Handle("/api/purchase", authMw.Middleware(purchaseProxy))

	protectedMux.Handle("/api/gateway/recommendations", authMw.Middleware(http.HandlerFunc(gatewayHandler.GetRecommendations)))
	protectedMux.Handle("/api/gateway/feed", authMw.Middleware(http.HandlerFunc(gatewayHandler.GetFeed)))
	protectedMux.Handle("/api/gateway/purchases", authMw.Middleware(http.HandlerFunc(gatewayHandler.GetPurchases)))
	protectedMux.Handle("/api/gateway/tour/{id}/locations", authMw.Middleware(http.HandlerFunc(gatewayHandler.GetTourLocations)))
	protectedMux.Handle("/api/gateway/tour/{id}/start", authMw.Middleware(http.HandlerFunc(gatewayHandler.StartTour)))
	protectedMux.Handle("/api/gateway/executions/{id}/abandon", authMw.Middleware(http.HandlerFunc(gatewayHandler.AbandonTour)))
	protectedMux.Handle("/api/gateway/executions/active", authMw.Middleware(http.HandlerFunc(gatewayHandler.GetActiveExecution)))
	protectedMux.Handle("/api/gateway/executions/{id}/check-proximity", authMw.Middleware(http.HandlerFunc(gatewayHandler.CheckProximity)))

	protectedMux.Handle("/api/admin/", authMw.Middleware(requireAdmin(adminProxy)))
	protectedMux.Handle("/api/admin", authMw.Middleware(requireAdmin(adminProxy)))

	rootMux := http.NewServeMux()
	rootMux.Handle("/api/auth/", publicMux)
	rootMux.Handle("/api/auth", publicMux)
	rootMux.Handle("/", protectedMux)

	return middleware.CORS(rootMux)
}