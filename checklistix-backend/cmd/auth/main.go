package main

import (
	"github.com/braincompiler/checklistix/internal/middleware"
	"github.com/braincompiler/checklistix/pkg/auth"
	"github.com/braincompiler/checklistix/pkg/auth/endpoints"
	"gofr.dev/pkg/gofr"
)

func main() {
	app := gofr.New()

	app.UseMiddleware(middleware.Auth(nil))

	var (
		service = auth.NewService()
	)

	endpoints.NewEndpoints(app, service)

	app.Run()
}
