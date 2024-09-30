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
	Create(*gofr.Context, *models.ChecklistPost) (*models.Checklist, error)
	Delete(*gofr.Context, uuid.UUID) error
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
		Select("id, title, updated, created", "exact", false).
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
				"pageSize, pageOrientation, columns, fontSize, "+
				"borderThickness, fontFamily, defaultColor, "+
				"checklistItems:checklist_items (checklistId, *, "+
				"subChecklistItems:sub_checklist_items (subChecklistId, *))",
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

func (c *checklistService) Create(ctx *gofr.Context, checklistPost *models.ChecklistPost) (*models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx.Request.Context())
	if err != nil {
		return nil, err
	}

	var checklists []models.Checklist
	count, err := client.
		From("checklists").
		Insert(checklistPost, false, "", "", "exact").
		ExecuteTo(&checklists)

	if err != nil {
		return nil, err
	}

	ctx.Logger.Debugf("Insert checklist: count = %d", count)

	return &checklists[0], nil
}

func (c *checklistService) Delete(ctx *gofr.Context, id uuid.UUID) error {
	client, err := supabase.NewClientWithContext(ctx.Request.Context())
	if err != nil {
		return err
	}

	_, count, err := client.
		From("checklists").
		Delete("", "exact").
		Eq("id", id.String()).
		Execute()

	if err != nil {
		return err
	}

	ctx.Logger.Debugf("Delete checklist: count = %d", count)

	return nil
}
