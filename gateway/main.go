package main

import (
	"log"
	"net/http"

	"gateway/internal/config"
	"gateway/internal/router"
)

func main() {
	cfg := config.Load()

	r := router.New(cfg)

	log.Println("Gateway running on :8080")

	srv := &http.Server{
		Addr:    ":8080",
		Handler: r,
	}

	log.Fatal(srv.ListenAndServe())
}