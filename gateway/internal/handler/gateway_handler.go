package handler

import (
	"encoding/json"
	"fmt"
	"gateway/internal/aggregate"
	"gateway/internal/client"
	"net/http"
	"strconv"
)

type GatewayHandler struct {
	RecommendationService *aggregate.RecommendationService
	FeedService           *aggregate.FeedService
	PurchaseService       *aggregate.PurchaseService
	UsersGRPCClient       *client.UsersGRPCClient
}

func NewGatewayHandler(
	recommendationService *aggregate.RecommendationService,
	feedService *aggregate.FeedService,
	purchaseService *aggregate.PurchaseService,
	usersGRPCClient *client.UsersGRPCClient,
) *GatewayHandler {
	return &GatewayHandler{
		RecommendationService: recommendationService,
		FeedService:           feedService,
		PurchaseService:       purchaseService,
		UsersGRPCClient:       usersGRPCClient,
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

func (h *GatewayHandler) StartTour(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	tourIDStr := r.PathValue("id")
	if tourIDStr == "" {
		http.Error(w, "missing tour id", http.StatusBadRequest)
		return
	}

	var tourID int
	fmt.Sscanf(tourIDStr, "%d", &tourID)

	execution, err := h.PurchaseService.StartTour(userID, role, tourID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(execution)
}

func (h *GatewayHandler) AbandonTour(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	executionIDStr := r.PathValue("id")
	if executionIDStr == "" {
		http.Error(w, "missing execution id", http.StatusBadRequest)
		return
	}

	var executionID int
	fmt.Sscanf(executionIDStr, "%d", &executionID)

	execution, err := h.PurchaseService.AbandonTour(userID, role, executionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(execution)
}

func (h *GatewayHandler) GetUserProfile(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	user, err := h.UsersGRPCClient.GetUser(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func (h *GatewayHandler) GetActiveExecution(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	if userID == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	execution, err := h.PurchaseService.GetActiveExecution(userID, role)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	if execution == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(execution)
}

func (h *GatewayHandler) CheckProximity(w http.ResponseWriter, r *http.Request) {
	userID := r.Header.Get("X-User-ID")
	role := r.Header.Get("X-Role")
	executionIDStr := r.PathValue("id")
	if executionIDStr == "" {
		http.Error(w, "missing execution id", http.StatusBadRequest)
		return
	}

	var executionID int
	fmt.Sscanf(executionIDStr, "%d", &executionID)

	execution, err := h.PurchaseService.CheckProximity(userID, role, executionID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(execution)
}
