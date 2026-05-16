package dto

type RecommendationsResponse struct {
	RecommendedUserIDs []int `json:"recommended_user_ids"`
}

type FollowingResponse struct {
	FollowingUserIDs []int `json:"following_user_ids"`
}

type FollowStatusResponse struct {
	Following bool `json:"following"`
}
