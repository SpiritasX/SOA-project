package client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"

	"gateway/internal/dto"
)

type BlogClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewBlogClient(baseURL string, httpClient *http.Client) *BlogClient {
	return &BlogClient{
		BaseURL:    baseURL,
		HTTPClient: httpClient,
	}
}

func (c *BlogClient) GetBlogsByUserIDs(userID string, role string, userIDs []int) ([]dto.SmallBlogDTO, error) {
	body, err := json.Marshal(userIDs)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", c.BaseURL+"/api/blog/by-user-ids", bytes.NewBuffer(body))
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
		return nil, fmt.Errorf("blog service returned status %d", resp.StatusCode)
	}

	var blogs []dto.SmallBlogDTO
	if err := json.NewDecoder(resp.Body).Decode(&blogs); err != nil {
		return nil, err
	}

	return blogs, nil
}

func (c *BlogClient) GetBlog(userID string, role string, blogID string) (*dto.SmallBlogDTO, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/api/blog/%s", c.BaseURL, blogID), nil)
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
		return nil, fmt.Errorf("blog service returned status %d", resp.StatusCode)
	}

	var blog dto.SmallBlogDTO
	if err := json.NewDecoder(resp.Body).Decode(&blog); err != nil {
		return nil, err
	}

	return &blog, nil
}
