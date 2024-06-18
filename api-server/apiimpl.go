package main

import (
	"encoding/json"
	"github.com/google/uuid"
	openapi_types "github.com/oapi-codegen/runtime/types"
	"net/http"
	"time"
)

type Server struct{}

func NewServer() Server {
	return Server{}
}

func (s Server) GetChecklists(w http.ResponseWriter, r *http.Request) {
	checklistId := uuid.New()

	checklistItem := SubChecklist{
		Id:          uuid.New(),
		ChecklistId: checklistId,
		Title:       "Preliminary Preflight Procedure",
		Color:       "#ededed",
		Items:       nil,
		Type:        ChecklistItemTypeSubChecklist,
	}
	checklistItemSubchecklist := Checklist_ChecklistItems_Item{}
	_ = checklistItemSubchecklist.FromSubChecklist(checklistItem)

	sectionTitle := SectionTitle{
		ChecklistId: checklistId,
		Color:       "#ededed",
		Id:          uuid.New(),
		Text:        "Section Title",
		Type:        ChecklistItemTypeSectionTitle,
	}
	checklistItemSectionTitle := Checklist_ChecklistItems_Item{}
	_ = checklistItemSectionTitle.FromSectionTitle(sectionTitle)

	checklists := []Checklist{
		{
			Id:              checklistId,
			Name:            "Checklist 1",
			Created:         time.Now(),
			Updated:         time.Now().AddDate(0, 0, 3),
			Style:           Dots,
			PageSize:        A4,
			PageOrientation: Portrait,
			Columns:         2,
			FontSize:        10,
			BorderThickness: 2,
			FontFamily:      "sans-serif",
			ChecklistItems: []Checklist_ChecklistItems_Item{
				checklistItemSubchecklist,
				checklistItemSectionTitle,
			},
		},
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(checklists)
}

func (s Server) PostChecklists(w http.ResponseWriter, r *http.Request) {
	//TODO implement me
	panic("implement me")
}

func (s Server) DeleteChecklistsId(w http.ResponseWriter, r *http.Request, id openapi_types.UUID) {
	//TODO implement me
	panic("implement me")
}

func createCheckItem(item, action string, subChecklistId openapi_types.UUID) SubChecklist_Items_Item {
	checkItem := SubChecklistItemCheckItem{
		Action:         action,
		Id:             uuid.New(),
		Item:           item,
		SubChecklistId: subChecklistId,
		Type:           CheckItem,
	}
	checkItemItem := SubChecklist_Items_Item{}
	_ = checkItemItem.FromSubChecklistItemCheckItem(checkItem)

	return checkItemItem
}

func createPrecondition(text string, subChecklistId openapi_types.UUID) SubChecklist_Items_Item {
	precondition := SubChecklistItemPrecondition{
		Id:             uuid.New(),
		SubChecklistId: subChecklistId,
		Text:           text,
		Type:           Precondition,
	}
	preconditionItem := SubChecklist_Items_Item{}
	_ = preconditionItem.FromSubChecklistItemPrecondition(precondition)

	return preconditionItem
}

func createPostcondition(text string, subChecklistId openapi_types.UUID) SubChecklist_Items_Item {
	postcondition := SubChecklistItemPostcondition{
		Id:             uuid.New(),
		SubChecklistId: subChecklistId,
		Text:           text,
		Type:           Postcondition,
	}
	postconditionItem := SubChecklist_Items_Item{}
	_ = postconditionItem.FromSubChecklistItemPostcondition(postcondition)

	return postconditionItem
}

func createSubtitle(text string, subChecklistId openapi_types.UUID) SubChecklist_Items_Item {
	subtitle := SubChecklistItemSubtitle{
		Id:             uuid.New(),
		SubChecklistId: subChecklistId,
		Text:           text,
		Type:           Subtitle,
	}
	subtitleItem := SubChecklist_Items_Item{}
	_ = subtitleItem.FromSubChecklistItemSubtitle(subtitle)

	return subtitleItem
}

func (s Server) GetChecklistsId(w http.ResponseWriter, r *http.Request, id openapi_types.UUID) {
	checklistId := uuid.New()

	subChecklistId := uuid.New()
	checklistItem := SubChecklist{
		Id:          subChecklistId,
		ChecklistId: checklistId,
		Title:       "Preliminary Preflight Procedure",
		Color:       "#ededed",
		Type:        ChecklistItemTypeSubChecklist,
		Items: []SubChecklist_Items_Item{
			createCheckItem("ADIRU Switch", "OFF 30 seconds, then ON", subChecklistId),
			createPrecondition("Precondition", subChecklistId),
			createCheckItem("Outside Check", "Done", subChecklistId),
			createPostcondition("Postcondition", subChecklistId),
			createCheckItem("THRUST & REV THRUST Levers", "DOWN/CLOSED", subChecklistId),
			createSubtitle("Subtitle", subChecklistId),
		},
	}
	checklistItemSubchecklist := Checklist_ChecklistItems_Item{}
	_ = checklistItemSubchecklist.FromSubChecklist(checklistItem)

	sectionTitle := SectionTitle{
		Id:          uuid.New(),
		ChecklistId: checklistId,
		Color:       "#ededed",
		Text:        "Section Title",
		Type:        ChecklistItemTypeSectionTitle,
	}
	checklistItemSectionTitle := Checklist_ChecklistItems_Item{}
	_ = checklistItemSectionTitle.FromSectionTitle(sectionTitle)

	checklist := Checklist{
		Id:              checklistId,
		Name:            "Checklist 1",
		Created:         time.Now(),
		Updated:         time.Now().AddDate(0, 0, 3),
		Style:           Dots,
		PageSize:        A4,
		PageOrientation: Portrait,
		Columns:         2,
		FontSize:        10,
		BorderThickness: 2,
		FontFamily:      "sans-serif",
		ChecklistItems: []Checklist_ChecklistItems_Item{
			checklistItemSubchecklist,
			checklistItemSectionTitle,
		},
	}

	w.WriteHeader(http.StatusOK)
	_ = json.NewEncoder(w).Encode(checklist)
}

func (s Server) PatchChecklistsId(w http.ResponseWriter, r *http.Request, id openapi_types.UUID) {
	//TODO implement me
	panic("implement me")
}

func (s Server) PutChecklistsId(w http.ResponseWriter, r *http.Request, id openapi_types.UUID) {
	//TODO implement me
	panic("implement me")
}
