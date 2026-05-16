package client

import (
	"encoding/json"
	"fmt"
	"net/http"

	"gateway/internal/dto"
)

type FollowersClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewFollowersClient(baseURL string, httpClient *http.Client) *FollowersClient {
	return &FollowersClient{
		BaseURL:    baseURL,
		HTTPClient: httpClient,
	}
}

func (c *FollowersClient) GetRecommendations(userID string) ([]int, error) {
	req, err := http.NewRequest("GET", c.BaseURL+"/api/followers/recommendations", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-User-ID", userID)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("followers service returned status %d", resp.StatusCode)
	}

	var result dto.RecommendationsResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result.RecommendedUserIDs, nil
}

func (c *FollowersClient) GetFollowing(userID string) ([]int, error) {
	req, err := http.NewRequest("GET", c.BaseURL+"/api/followers/me", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-User-ID", userID)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("followers service returned status %d", resp.StatusCode)
	}

	var result dto.FollowingResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result.FollowingUserIDs, nil
}

func (c *FollowersClient) IsFollowing(userID string, targetUserID string) (bool, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/followers/%s/status", c.BaseURL, targetUserID), nil)
	if err != nil {
		return false, err
	}

	req.Header.Set("X-User-ID", userID)

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return false, fmt.Errorf("followers service returned status %d", resp.StatusCode)
	}

	var result dto.FollowStatusResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return false, err
	}

	return result.Following, nil
}
