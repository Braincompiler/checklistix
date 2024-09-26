package main

import (
	"github.com/braincompiler/checklistix/internal/middleware"
	"github.com/braincompiler/checklistix/pkg/checklists"
	"github.com/braincompiler/checklistix/pkg/checklists/endpoints"
	"gofr.dev/pkg/gofr"
	"gofr.dev/pkg/gofr/datasource/redis"
)

func main() {
	app := gofr.New()

	r := redis.NewClient(app.Config, app.Logger(), app.Metrics())
	app.UseMiddleware(middleware.Auth(r))

	var (
		service = checklists.NewService()
	)

	endpoints.NewEndpoints(app, service)

	app.Run()
}
