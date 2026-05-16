package dto

type ListViewDTO struct {
	ID        int    `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Role      string `json:"role"`
	Status    string `json:"status"`
}
