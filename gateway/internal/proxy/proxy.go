package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
)

func New(target string) http.HandlerFunc {
	parsed, err := url.Parse(target)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(parsed)

	return func(w http.ResponseWriter, r *http.Request) {

		// TODO edit requests before continuing?

		proxy.ServeHTTP(w, r)
	}
}