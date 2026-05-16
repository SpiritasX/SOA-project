package aggregate

import (
	"gateway/internal/client"
	"gateway/internal/dto"
)

type FeedService struct {
	FollowersClient *client.FollowersClient
	BlogClient      *client.BlogClient
}

func NewFeedService(
	followersClient *client.FollowersClient,
	blogClient *client.BlogClient,
) *FeedService {
	return &FeedService{
		FollowersClient: followersClient,
		BlogClient:      blogClient,
	}
}

func (s *FeedService) GetFeed(userID string, role string) ([]dto.SmallBlogDTO, error) {
	followingIDs, err := s.FollowersClient.GetFollowing(userID)
	if err != nil {
		return nil, err
	}

	if len(followingIDs) == 0 {
		return []dto.SmallBlogDTO{}, nil
	}

	blogs, err := s.BlogClient.GetBlogsByUserIDs(userID, role, followingIDs)
	if err != nil {
		return nil, err
	}

	return blogs, nil
}
