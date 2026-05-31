package client

import (
	"encoding/json"
	"fmt"
	"gateway/internal/dto"
	"net/http"
)

type TourClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewTourClient(baseURL string, httpClient *http.Client) *TourClient {
	return &TourClient{
		BaseURL:    baseURL,
		HTTPClient: httpClient,
	}
}

func (c *TourClient) GetTour(userID string, role string, tourID int) (*dto.TourDTO, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/tour/%d", c.BaseURL, tourID), nil)
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
		return nil, fmt.Errorf("tour service returned status %d", resp.StatusCode)
	}

	var tour dto.TourDTO
	if err := json.NewDecoder(resp.Body).Decode(&tour); err != nil {
		return nil, err
	}

	return &tour, nil
}

func (c *TourClient) GetTourLocations(userID string, role string, tourID int, isPurchased bool) ([]dto.TourLocationDTO, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/tour/%d/locations?isPurchased=%t", c.BaseURL, tourID, isPurchased), nil)
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
		return nil, fmt.Errorf("tour service returned status %d", resp.StatusCode)
	}

	var locations []dto.TourLocationDTO
	if err := json.NewDecoder(resp.Body).Decode(&locations); err != nil {
		return nil, err
	}

	return locations, nil
}
