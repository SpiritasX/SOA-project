package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"gateway/internal/dto"
)

type UsersClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewUsersClient(baseURL string, httpClient *http.Client) *UsersClient {
	return &UsersClient{
		BaseURL:    baseURL,
		HTTPClient: httpClient,
	}
}

func (c *UsersClient) GetUsersBatch(userID string, role string, userIDs []int) ([]dto.ListViewDTO, error) {
	body, err := json.Marshal(userIDs)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", c.BaseURL+"/api/user/batch", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-User-ID", userID)
	req.Header.Set("X-Role", role)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("stakeholders service returned status %d", resp.StatusCode)
	}

	var users []dto.ListViewDTO
	if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
		return nil, err
	}

	return users, nil
}
