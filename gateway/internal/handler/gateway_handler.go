package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gateway/internal/aggregate"
)

type GatewayHandler struct {
	RecommendationService *aggregate.RecommendationService
	FeedService           *aggregate.FeedService
	PurchaseService       *aggregate.PurchaseService
}

func NewGatewayHandler(
	recommendationService *aggregate.RecommendationService,
	feedService *aggregate.FeedService,
	purchaseService *aggregate.PurchaseService,
) *GatewayHandler {
	return &GatewayHandler{
		RecommendationService: recommendationService,
		FeedService:           feedService,
		PurchaseService:       purchaseService,
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

func (h *GatewayHandler) GetPurchases(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	purchases, err := h.PurchaseService.GetAggregatedPurchases(userID, role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(purchases)
}

func (h *GatewayHandler) GetTourLocations(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	tourIDStr := r.PathValue("id")
	if tourIDStr == "" {
		http.Error(w, "missing tour id", http.StatusBadRequest)
		return
	}

	var tourID int
	fmt.Sscanf(tourIDStr, "%d", &tourID)

	locations, err := h.PurchaseService.GetTourLocations(userID, role, tourID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(locations)
}
