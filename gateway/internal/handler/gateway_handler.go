package handler

import (
	"encoding/json"
	"net/http"

	"gateway/internal/aggregate"
)

type GatewayHandler struct {
	RecommendationService *aggregate.RecommendationService
	FeedService           *aggregate.FeedService
}

func NewGatewayHandler(
	recommendationService *aggregate.RecommendationService,
	feedService *aggregate.FeedService,
) *GatewayHandler {
	return &GatewayHandler{
		RecommendationService: recommendationService,
		FeedService:           feedService,
	}
}

func (h *GatewayHandler) GetRecommendations(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	users, err := h.RecommendationService.GetRecommendations(userID, role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func (h *GatewayHandler) GetFeed(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	blogs, err := h.FeedService.GetFeed(userID, role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(blogs)
}
