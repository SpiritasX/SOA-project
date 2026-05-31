package dto

type TourDTO struct {
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Tags        []string `json:"tags"`
	Price       float64  `json:"price"`
	Difficulty  string   `json:"difficulty"`
	Status      string   `json:"status"`
}

type TourLocationDTO struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImagePath   string  `json:"imagePath"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type TourExecutionDTO struct {
	ID                 int            `json:"id"`
	UserID             int            `json:"userId"`
	TourID             int            `json:"tourId"`
	Status             string         `json:"status"`
	StartTime          string         `json:"startTime"`
	EndTime            string         `json:"endTime"`
	LastActivity       string         `json:"lastActivity"`
	StartLocation      LocationDTO    `json:"startLocation"`
	CompletedLocations map[int]string `json:"completedLocations"`
}

type LocationDTO struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
