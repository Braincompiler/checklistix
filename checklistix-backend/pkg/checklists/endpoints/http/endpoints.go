package http

import (
	"github.com/braincompiler/checklistix/internal/models"
	"gofr.dev/pkg/gofr"

	"github.com/braincompiler/checklistix/pkg/checklists"
	"github.com/google/uuid"
)

func NewEndpoints(app *gofr.App, svc checklists.Service) {
	app.GET("/checklists", MakeGetAll(svc))
	app.GET("/checklists/{id}", MakeGetById(svc))
	app.GET("/checklists/{id}/copy", MakeCopyById(svc))
	app.POST("/checklists", MakeCreateChecklist(svc))
	app.DELETE("/checklists/{id}", MakeDeleteById(svc))
	app.PATCH("/checklists/{id}", MakeUpdateById(svc))
	app.POST("/checklists/{id}/checklist-items", MakeAddChecklistItem(svc))
	app.PATCH("/checklist-items/positions", MakeUpdateChecklistItemPositions(svc))
	app.PATCH("/checklist-items/{id}", MakeUpdateChecklistItemById(svc))
	app.DELETE("/checklist-items/{id}", MakeDeleteChecklistItemById(svc))
	app.POST("/checklist-items/{id}/sub-checklist-items", MakeAddSubChecklistItem(svc))
	app.PATCH("/sub-checklist-items/positions", MakeUpdateSubChecklistItemPositions(svc))
	app.PATCH("/sub-checklist-items/{id}", MakeUpdateSubChecklistItemById(svc))
	app.DELETE("/sub-checklist-items/{id}", MakeDeleteSubChecklistItemById(svc))
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

func MakeCopyById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return svc.CopyById(ctx, id)
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

func MakeUpdateById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var checklist models.ChecklistWithoutItems

		err := ctx.Bind(&checklist)
		if err != nil {
			return nil, err
		}

		return svc.Update(ctx, &checklist)
	}
}

func MakeAddChecklistItem(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var checklistItem models.ChecklistItemPost

		err := ctx.Bind(&checklistItem)
		if err != nil {
			return nil, err
		}

		return svc.AddChecklistItem(ctx, &checklistItem)
	}
}

func MakeUpdateChecklistItemById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var checklistItemPatch models.ChecklistItemPatch

		err := ctx.Bind(&checklistItemPatch)
		if err != nil {
			return nil, err
		}

		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return svc.UpdateChecklistItem(ctx, &checklistItemPatch, id)
	}
}

func MakeDeleteChecklistItemById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return nil, svc.DeleteChecklistItem(ctx, id)
	}
}

func MakeAddSubChecklistItem(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var subChecklistItem models.SubChecklistFormSubChecklistItemsInner

		err := ctx.Bind(&subChecklistItem)
		if err != nil {
			return nil, err
		}

		return svc.AddSubChecklistItem(ctx, &subChecklistItem)
	}
}

func MakeUpdateSubChecklistItemById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var subChecklistItemPatch models.SubChecklistItemPatch

		err := ctx.Bind(&subChecklistItemPatch)
		if err != nil {
			return nil, err
		}

		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return svc.UpdateSubChecklistItem(ctx, &subChecklistItemPatch, id)
	}
}

func MakeUpdateSubChecklistItemPositions(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var subChecklistItemPatches []models.SubChecklistFormSubChecklistItemsInner

		err := ctx.Bind(&subChecklistItemPatches)
		if err != nil {
			return nil, err
		}

		return nil, svc.UpdateSubChecklistItemPositions(ctx, subChecklistItemPatches)
	}
}

func MakeUpdateChecklistItemPositions(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		var checklistItemPatches []models.ChecklistItemPositionPatch

		err := ctx.Bind(&checklistItemPatches)
		if err != nil {
			return nil, err
		}

		return nil, svc.UpdateChecklistItemPositions(ctx, checklistItemPatches)
	}
}

func MakeDeleteSubChecklistItemById(svc checklists.Service) gofr.Handler {
	return func(ctx *gofr.Context) (interface{}, error) {
		id, err := uuid.Parse(ctx.Request.PathParam("id"))
		if err != nil {
			return nil, err
		}

		return nil, svc.DeleteSubChecklistItem(ctx, id)
	}
}
