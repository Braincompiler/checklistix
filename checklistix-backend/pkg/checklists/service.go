package checklists

import (
	"github.com/braincompiler/checklistix/internal/models"
	"github.com/braincompiler/checklistix/internal/supabase"
	"github.com/google/uuid"
	"gofr.dev/pkg/gofr"
)

type Service interface {
	GetAll(*gofr.Context) ([]models.Checklist, error)
	GetById(*gofr.Context, uuid.UUID) (*models.Checklist, error)
}

type checklistService struct{}

func NewService() Service {
	return &checklistService{}
}

func (c *checklistService) GetAll(ctx *gofr.Context) ([]models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx.Request.Context())
	if err != nil {
		return nil, err
	}

	var checklists []models.Checklist

	_, err = client.
		From("checklists").
		Select("*", "exact", false).
		ExecuteTo(&checklists)

	if err != nil {
		return nil, err
	}

	if checklists == nil {
		checklists = []models.Checklist{}
	}

	return checklists, nil
}

func (c *checklistService) GetById(ctx *gofr.Context, id uuid.UUID) (*models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx.Request.Context())
	if err != nil {
		return nil, err
	}

	var checklist models.Checklist

	_, err = client.
		From("checklists").
		Select(
			"id, title, created, updated, style, "+
				"pageSize:page_size, pageOrientation:page_orientation, columns, fontSize:font_size, "+
				"borderThickness:border_thickness, fontFamily:font_family, defaultColor:default_color, "+
				"checklistItems:checklist_items (checklistId:checklist_id, *, "+
				"subChecklistItems:sub_checklist_items (subChecklistId:sub_checklist_id, *))",
			"exact",
			false,
		).
		Eq("id", id.String()).
		Single().
		ExecuteTo(&checklist)
	if err != nil {
		return nil, err
	}

	return &checklist, nil
}
