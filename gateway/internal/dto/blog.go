package dto

type CommentDTO struct {
	AuthorID  int `json:"authorId"`
	Content   string `json:"content"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type SmallBlogDTO struct {
	ID          string       `json:"id"`
	AuthorID    int          `json:"authorId"`
	Title       string       `json:"title"`
	Description string       `json:"description"`
	CreatedAt   string       `json:"createdAt"`
	Comments    []CommentDTO `json:"comments"`
	Likes       int          `json:"likes"`
}
