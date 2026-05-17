package config

import "os"

type Config struct {
	JWTSecret string
	Services  map[string]string
}

func Load() Config {
	return Config{
		JWTSecret: os.Getenv("JWT_SECRET"),

		Services: map[string]string{
			"auth":        "http://auth:8080",
			"stakeholders": "http://stakeholders:8080",
			"blog":        "http://blog:8080",
			"followers":   "http://followers:8080",
			"tour":		   "http://tour:8080",
		},
	}
}
