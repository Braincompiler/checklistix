package endpoints

import (
	"gofr.dev/pkg/gofr"

	"github.com/braincompiler/checklistix/pkg/checklists"
	"github.com/google/uuid"
)

func NewEndpoints(app *gofr.App, svc checklists.Service) {
	app.GET("/checklists", MakeGetAll(svc))
	app.GET("/checklists/{id}", MakeGetById(svc))
}

func MakeGetAll(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		return svc.GetAll(ctx)
	}
}

func MakeGetById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return svc.GetById(ctx, id)
	}
}
