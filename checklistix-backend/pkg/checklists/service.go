package checklists

import (
	"context"
	"github.com/braincompiler/checklistix/internal/models"
	"github.com/braincompiler/checklistix/internal/supabase"
	"github.com/google/uuid"
	"github.com/supabase-community/postgrest-go"
	"time"
)

type Service interface {
	GetAll(context.Context) ([]models.Checklist, error)
	GetById(context.Context, uuid.UUID) (*models.Checklist, error)
	CopyById(context.Context, uuid.UUID) (*models.Checklist, error)
	Create(context.Context, *models.ChecklistPost) (*models.Checklist, error)
	Delete(context.Context, uuid.UUID) error
	Update(context.Context, *models.ChecklistWithoutItems) (*models.ChecklistWithoutItems, error)
	AddChecklistItem(context.Context, *models.ChecklistItemPost) (*models.ChecklistFormChecklistItemsInnerWithoutSubChecklistItems, error)
	UpdateChecklistItem(context.Context, *models.ChecklistItemPatch, uuid.UUID) (*models.ChecklistItemPatch, error)
	DeleteChecklistItem(context.Context, uuid.UUID) error
	AddSubChecklistItem(context.Context, *models.SubChecklistFormSubChecklistItemsInner) (*models.SubChecklistFormSubChecklistItemsInner, error)
	UpdateChecklistItemPositions(context.Context, []models.ChecklistItemPositionPatch) error
	UpdateSubChecklistItem(context.Context, *models.SubChecklistItemPatch, uuid.UUID) (*models.SubChecklistFormSubChecklistItemsInner, error)
	UpdateSubChecklistItemPositions(context.Context, []models.SubChecklistFormSubChecklistItemsInner) error
	DeleteSubChecklistItem(context.Context, uuid.UUID) error
}

type checklistService struct{}

func NewService() Service {
	return &checklistService{}
}

func (c *checklistService) GetAll(ctx context.Context) ([]models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx)
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

func (c *checklistService) GetById(ctx context.Context, id uuid.UUID) (*models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx)
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
				"subChecklistItems:sub_checklist_items (checklistItemId, *))",
			"exact",
			false,
		).
		Eq("id", id.String()).
		Order("position", &postgrest.OrderOpts{
			Ascending:    true,
			NullsFirst:   false,
			ForeignTable: "checklistItems",
		}).
		Order("position", &postgrest.OrderOpts{
			Ascending:    true,
			NullsFirst:   false,
			ForeignTable: "checklistItems.subChecklistItems",
		}).
		Single().
		ExecuteTo(&checklist)
	if err != nil {
		return nil, err
	}

	return &checklist, nil
}

func (c *checklistService) CopyById(ctx context.Context, id uuid.UUID) (*models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx)
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
				"subChecklistItems:sub_checklist_items (checklistItemId, *))",
			"exact",
			false,
		).
		Eq("id", id.String()).
		Single().
		ExecuteTo(&checklist)
	if err != nil {
		return nil, err
	}

	newChecklist, err := c.Create(ctx, &models.ChecklistPost{
		Title:           "Copy from " + checklist.Title,
		Created:         time.Now(),
		Updated:         time.Now(),
		Style:           checklist.Style,
		PageSize:        checklist.PageSize,
		PageOrientation: checklist.PageOrientation,
		Columns:         checklist.Columns,
		FontSize:        checklist.FontSize,
		BorderThickness: checklist.BorderThickness,
		FontFamily:      checklist.FontFamily,
		DefaultColor:    checklist.DefaultColor,
	})
	if err != nil {
		return nil, err
	}

	//checklistItemsCopy := make([]models.ChecklistFormChecklistItemsInner, len(checklist.ChecklistItems))
	//copy(checklistItemsCopy, checklist.ChecklistItems)

	for _, checklistItem := range checklist.ChecklistItems {
		newChecklistItem, err := c.AddChecklistItem(ctx, &models.ChecklistItemPost{
			//Id:          "",
			ChecklistId: newChecklist.Id.String(),
			Column:      checklistItem.Column,
			Page:        checklistItem.Page,
			Position:    checklistItem.Position,
			Type:        checklistItem.Type,
			Title:       checklistItem.Title,
			Color:       checklistItem.Color,
			Text:        checklistItem.Text,
		})
		if err != nil {
			return nil, err
		}

		for _, subChecklistItem := range checklistItem.SubChecklistItems {
			_, err := c.AddSubChecklistItem(ctx, &models.SubChecklistFormSubChecklistItemsInner{
				Id:              uuid.NewString(),
				ChecklistItemId: newChecklistItem.Id.String(),
				Type:            subChecklistItem.Type,
				Position:        subChecklistItem.Position,
				Item:            subChecklistItem.Item,
				Action:          subChecklistItem.Action,
				Text:            subChecklistItem.Text,
			})
			if err != nil {
				return nil, err
			}
		}
	}

	// @TODO: This is not working. We have to insert all the rows by our self
	// -> first the checklist (with new ID)
	// -> second the checklist_items (with new IDs and checklistId is the new checklist.Id)
	// -> third the sub_checklist_items (with new IDs and subChecklistId is the new checklistItem.Id)
	//var checklists []models.Checklist
	//_, err = client.
	//	From("checklists").
	//	Insert(checklist, false, "", "", "exact").
	//	ExecuteTo(&checklists)
	//
	//if err != nil {
	//	return nil, err
	//}

	return newChecklist, nil
}

func (c *checklistService) Create(ctx context.Context, checklistPost *models.ChecklistPost) (*models.Checklist, error) {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return nil, err
	}

	var checklists []models.Checklist
	_, err = client.
		From("checklists").
		Insert(checklistPost, false, "", "", "exact").
		ExecuteTo(&checklists)

	if err != nil {
		return nil, err
	}

	return &checklists[0], nil
}

func (c *checklistService) Delete(ctx context.Context, id uuid.UUID) error {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return err
	}

	_, _, err = client.
		From("checklists").
		Delete("", "exact").
		Eq("id", id.String()).
		Execute()

	if err != nil {
		return err
	}

	return nil
}

func (c *checklistService) Update(ctx context.Context, checklist *models.ChecklistWithoutItems) (*models.ChecklistWithoutItems, error) {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return nil, err
	}

	var checklists []models.ChecklistWithoutItems
	_, err = client.
		From("checklists").
		Update(checklist, "", "exact").
		Eq("id", checklist.Id.String()).
		ExecuteTo(&checklists)

	if err != nil {
		return nil, err
	}

	return &checklists[0], nil
}

func (c *checklistService) AddChecklistItem(ctx context.Context, checklistItem *models.ChecklistItemPost) (*models.ChecklistFormChecklistItemsInnerWithoutSubChecklistItems, error) {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return nil, err
	}

	var checklistItems []models.ChecklistFormChecklistItemsInnerWithoutSubChecklistItems
	_, err = client.
		From("checklist_items").
		Insert(checklistItem, false, "", "", "exact").
		ExecuteTo(&checklistItems)

	if err != nil {
		return nil, err
	}

	return &checklistItems[0], nil
}

func (c *checklistService) UpdateChecklistItem(
	ctx context.Context,
	checklistItemPatch *models.ChecklistItemPatch,
	id uuid.UUID) (*models.ChecklistItemPatch, error,
) {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return nil, err
	}

	var checklistItems []models.ChecklistItemPatch
	_, err = client.
		From("checklist_items").
		Update(checklistItemPatch, "", "exact").
		Eq("id", id.String()).
		ExecuteTo(&checklistItems)

	if err != nil {
		return nil, err
	}

	return &checklistItems[0], nil
}

func (c *checklistService) DeleteChecklistItem(
	ctx context.Context,
	id uuid.UUID) error {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return err
	}

	_, _, err = client.
		From("checklist_items").
		Delete("", "exact").
		Eq("id", id.String()).
		Execute()

	if err != nil {
		return err
	}

	return nil
}

func (c *checklistService) AddSubChecklistItem(ctx context.Context, subChecklistItem *models.SubChecklistFormSubChecklistItemsInner) (*models.SubChecklistFormSubChecklistItemsInner, error) {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return nil, err
	}

	var subChecklistItems []models.SubChecklistFormSubChecklistItemsInner
	_, err = client.
		From("sub_checklist_items").
		Insert(subChecklistItem, false, "", "", "exact").
		ExecuteTo(&subChecklistItems)

	if err != nil {
		return nil, err
	}

	return &subChecklistItems[0], nil
}

func (c *checklistService) UpdateSubChecklistItem(
	ctx context.Context,
	subChecklistItemPatch *models.SubChecklistItemPatch,
	id uuid.UUID) (*models.SubChecklistFormSubChecklistItemsInner, error,
) {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return nil, err
	}

	var subChecklistItems []models.SubChecklistFormSubChecklistItemsInner
	_, err = client.
		From("sub_checklist_items").
		Update(subChecklistItemPatch, "", "exact").
		Eq("id", id.String()).
		ExecuteTo(&subChecklistItems)

	if err != nil {
		return nil, err
	}

	return &subChecklistItems[0], nil
}

func (c *checklistService) UpdateSubChecklistItemPositions(
	ctx context.Context,
	bulkSubChecklistItems []models.SubChecklistFormSubChecklistItemsInner) error {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return err
	}

	for _, subChecklistItem := range bulkSubChecklistItems {
		position, _ := subChecklistItem.Position.Int64()
		_, _, err = client.
			From("sub_checklist_items").
			Update(struct {
				Position int `json:"position"`
			}{
				Position: int(position),
			}, "", "exact").
			Eq("id", subChecklistItem.Id).
			Execute()
	}

	if err != nil {
		return err
	}

	return nil
}

func (c *checklistService) UpdateChecklistItemPositions(
	ctx context.Context,
	checklistItemPatches []models.ChecklistItemPositionPatch) error {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return err
	}

	for _, checklistItem := range checklistItemPatches {
		position, _ := checklistItem.Position.Int64()
		_, _, err = client.
			From("checklist_items").
			Update(struct {
				Position int `json:"position"`
			}{
				Position: int(position),
			}, "", "exact").
			Eq("id", checklistItem.Id).
			Execute()
	}

	if err != nil {
		return err
	}

	return nil
}

func (c *checklistService) DeleteSubChecklistItem(
	ctx context.Context,
	id uuid.UUID) error {
	client, err := supabase.NewClientWithContext(ctx)
	if err != nil {
		return err
	}

	_, _, err = client.
		From("sub_checklist_items").
		Delete("", "exact").
		Eq("id", id.String()).
		Execute()

	if err != nil {
		return err
	}

	return nil
}
