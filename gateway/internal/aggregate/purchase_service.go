package aggregate

import (
	"fmt"
	"gateway/internal/client"
	"gateway/internal/dto"
)

type PurchaseService struct {
	PurchaseClient *client.PurchaseClient
	TourClient     *client.TourClient
}

func NewPurchaseService(
	purchaseClient *client.PurchaseClient,
	tourClient *client.TourClient,
) *PurchaseService {
	return &PurchaseService{
		PurchaseClient: purchaseClient,
		TourClient:     tourClient,
	}
}

func (s *PurchaseService) GetAggregatedPurchases(userID string, role string) ([]dto.AggregatedOrderDTO, error) {
	orders, err := s.PurchaseClient.GetMyPurchases(userID, role)
	if err != nil {
		return nil, err
	}

	aggregatedOrders := make([]dto.AggregatedOrderDTO, 0, len(orders))
	for _, order := range orders {
		aggregatedOrder := dto.AggregatedOrderDTO{
			ID:         order.ID,
			TotalPrice: order.Price,
			Tours:      make([]dto.TourDTO, 0, len(order.TourIds)),
		}

		for _, tourID := range order.TourIds {
			tour, err := s.TourClient.GetTour(userID, role, tourID)
			if err != nil {
				return nil, err
			}
			aggregatedOrder.Tours = append(aggregatedOrder.Tours, *tour)
		}

		aggregatedOrders = append(aggregatedOrders, aggregatedOrder)
	}

	return aggregatedOrders, nil
}

func (s *PurchaseService) GetTourLocations(userID string, role string, tourID int) ([]dto.TourLocationDTO, error) {
	orders, err := s.PurchaseClient.GetMyPurchases(userID, role)
	if err != nil {
		return nil, err
	}

	isPurchased := false
	for _, order := range orders {
		for _, id := range order.TourIds {
			if id == tourID {
				isPurchased = true
				break
			}
		}
		if isPurchased {
			break
		}
	}

	return s.TourClient.GetTourLocations(userID, role, tourID, isPurchased)
}

func (s *PurchaseService) StartTour(userID string, role string, tourID int) (*dto.TourExecutionDTO, error) {
	orders, err := s.PurchaseClient.GetMyPurchases(userID, role)
	if err != nil {
		return nil, err
	}

	isPurchased := false
	for _, order := range orders {
		for _, id := range order.TourIds {
			if id == tourID {
				isPurchased = true
				break
			}
		}
		if isPurchased {
			break
		}
	}

	if !isPurchased {
		return nil, fmt.Errorf("tour not purchased")
	}

	return s.TourClient.StartTour(userID, role, tourID)
}

func (s *PurchaseService) AbandonTour(userID string, role string, executionID int) (*dto.TourExecutionDTO, error) {
	return s.TourClient.AbandonTour(userID, role, executionID)
}

func (s *PurchaseService) GetActiveExecution(userID string, role string) (*dto.TourExecutionDTO, error) {
	return s.TourClient.GetActiveExecution(userID, role)
}

func (s *PurchaseService) CheckProximity(userID string, role string, executionID int) (*dto.TourExecutionDTO, error) {
	return s.TourClient.CheckProximity(userID, role, executionID)
}
