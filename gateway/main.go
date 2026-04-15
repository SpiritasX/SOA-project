package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Gateway running"))
	})

	log.Println("Gateway running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
