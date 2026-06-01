package client

import (
	"context"
	"gateway/internal/dto"
	"gateway/internal/pb"

	"google.golang.org/grpc"
)

type UsersGRPCClient struct {
	client pb.UserServiceClient
}

func NewUsersGRPCClient(conn *grpc.ClientConn) *UsersGRPCClient {
	return &UsersGRPCClient{client: pb.NewUserServiceClient(conn)}
}

func (c *UsersGRPCClient) GetUser(id int64) (*dto.UserDTO, error) {
	resp, err := c.client.GetUser(context.Background(), &pb.GetUserRequest{Id: id})
	if err != nil {
		return nil, err
	}
	return &dto.UserDTO{
		ID:        resp.Id,
		FirstName: resp.FirstName,
		LastName:  resp.LastName,
		Role:      resp.Role,
		Bio:       resp.Bio,
	}, nil
}
