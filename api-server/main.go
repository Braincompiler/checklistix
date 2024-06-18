package main

import (
	"github.com/rs/cors"
	"log"
	"net/http"
)

func main() {
	// create a type that satisfies the `api.ServerInterface`, which contains an implementation of every operation from the generated code
	server := NewServer()

	r := http.NewServeMux()

	// get an `http.Handler` that we can use
	h := HandlerWithOptions(server, StdHTTPServerOptions{
		BaseRouter: r,
		Middlewares: []MiddlewareFunc{
			func(next http.Handler) http.Handler {
				return cors.AllowAll().Handler(next)
			},
		},
		ErrorHandlerFunc: nil,
	})

	s := &http.Server{
		Handler: h,
		Addr:    "0.0.0.0:5555",
	}

	// And we serve HTTP until the world ends.
	err := s.ListenAndServe()
	log.Fatal("Error while running server", err)
}
