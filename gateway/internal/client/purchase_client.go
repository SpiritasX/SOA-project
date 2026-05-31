package client

import (
	"encoding/json"
	"fmt"
	"gateway/internal/dto"
	"net/http"
)

type PurchaseClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewPurchaseClient(baseURL string, httpClient *http.Client) *PurchaseClient {
	return &PurchaseClient{
		BaseURL:    baseURL,
		HTTPClient: httpClient,
	}
}

func (c *PurchaseClient) GetMyPurchases(userID string, role string) ([]dto.OrderDTO, error) {
	req, err := http.NewRequest("GET", c.BaseURL+"/api/purchase/me", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-User-ID", userID)
	req.Header.Set("X-Role", role)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("purchase service returned status %d", resp.StatusCode)
	}

	var orders []dto.OrderDTO
	if err := json.NewDecoder(resp.Body).Decode(&orders); err != nil {
		return nil, err
	}

	return orders, nil
}
