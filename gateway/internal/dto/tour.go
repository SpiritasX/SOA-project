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
