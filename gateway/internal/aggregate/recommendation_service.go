package aggregate

import (
	"gateway/internal/client"
	"gateway/internal/dto"
)

type RecommendationService struct {
	FollowersClient *client.FollowersClient
	UsersClient     *client.UsersClient
}

func NewRecommendationService(
	followersClient *client.FollowersClient,
	usersClient *client.UsersClient,
) *RecommendationService {
	return &RecommendationService{
		FollowersClient: followersClient,
		UsersClient:     usersClient,
	}
}

func (s *RecommendationService) GetRecommendations(userID string, role string) ([]dto.ListViewDTO, error) {
	recommendedIDs, err := s.FollowersClient.GetRecommendations(userID)
	if err != nil {
		return nil, err
	}

	if len(recommendedIDs) == 0 {
		return []dto.ListViewDTO{}, nil
	}

	users, err := s.UsersClient.GetUsersBatch(userID, role, recommendedIDs)
	if err != nil {
		return nil, err
	}

	return users, nil
}
