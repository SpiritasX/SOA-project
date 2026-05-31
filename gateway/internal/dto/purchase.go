package dto

type OrderDTO struct {
	ID      int     `json:"id"`
	Price   float64 `json:"price"`
	TourIds []int   `json:"tourIds"`
	UserID  int     `json:"userId"`
	Status  string  `json:"status"`
}

type AggregatedOrderDTO struct {
	ID         int       `json:"id"`
	TotalPrice float64   `json:"totalPrice"`
	Tours      []TourDTO `json:"tours"`
}
