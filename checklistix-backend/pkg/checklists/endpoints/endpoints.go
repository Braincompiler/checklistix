package endpoints

import (
	"github.com/braincompiler/checklistix/internal/models"
	"gofr.dev/pkg/gofr"

	"github.com/braincompiler/checklistix/pkg/checklists"
	"github.com/google/uuid"
)

func NewEndpoints(app *gofr.App, svc checklists.Service) {
	app.GET("/checklists", MakeGetAll(svc))
	app.GET("/checklists/{id}", MakeGetById(svc))
	app.POST("/checklists", MakeCreateChecklist(svc))
	app.DELETE("/checklists/{id}", MakeDeleteById(svc))
}

func MakeGetAll(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		return svc.GetAll(ctx)
	}
}

func MakeCreateChecklist(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var checklist models.ChecklistPost

		err := ctx.Bind(&checklist)
		if err != nil {
			return nil, err
		}

		return svc.Create(ctx, &checklist)
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

func MakeDeleteById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return nil, svc.Delete(ctx, id)
	}
}
