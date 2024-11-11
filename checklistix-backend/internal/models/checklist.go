package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type ChecklistStyle string

const (
	Dots    ChecklistStyle = "Dots"
	Line    ChecklistStyle = "Line"
	MidDots ChecklistStyle = "MidDots"
	Dashed  ChecklistStyle = "Dashed"
)

type PageSize string

const (
	A4         PageSize = "A4"
	A5         PageSize = "A5"
	Letter     PageSize = "Letter"
	HalfLetter PageSize = "HalfLetter"
)

type PageOrientation string

const (
	Portrait  PageOrientation = "Portrait"
	Landscape PageOrientation = "Landscape"
)

type BorderThickness int

const (
	None   BorderThickness = 0
	Thin   BorderThickness = 1
	Medium BorderThickness = 2
	Thick  BorderThickness = 4
)

type ChecklistItemType string

const (
	SubChecklist ChecklistItemType = "SubChecklist"
	SectionTitle ChecklistItemType = "SectionTitle"
	TextBox      ChecklistItemType = "TextBox"
)

type SubChecklistItemType string

const (
	CheckItem     SubChecklistItemType = "CheckItem"
	Precondition  SubChecklistItemType = "Precondition"
	Postcondition SubChecklistItemType = "Postcondition"
	Subtitle      SubChecklistItemType = "Subtitle"
	LeftText      SubChecklistItemType = "LeftText"
	RightText     SubChecklistItemType = "RightText"
)

type ChecklistPost struct {
	Title           string          `json:"title" mapstructure:"title"`
	Created         time.Time       `json:"created" mapstructure:"created"`
	Updated         time.Time       `json:"updated,omitempty" mapstructure:"updated"`
	Style           ChecklistStyle  `json:"style,omitempty" mapstructure:"style"`
	PageSize        PageSize        `json:"pageSize,omitempty" mapstructure:"pageSize"`
	PageOrientation PageOrientation `json:"pageOrientation,omitempty" mapstructure:"pageOrientation"`
	Columns         json.Number     `json:"columns,omitempty" type:"integer" mapstructure:"columns"`
	FontSize        json.Number     `json:"fontSize,omitempty" type:"integer" mapstructure:"fontSize"`
	BorderThickness json.Number     `json:"borderThickness,omitempty" type:"BorderThickness" mapstructure:"borderThickness"`
	FontFamily      string          `json:"fontFamily,omitempty" mapstructure:"fontFamily"`
	DefaultColor    string          `json:"defaultColor,omitempty" mapstructure:"defaultColor"`
}

type ChecklistWithoutItems struct {
	*ChecklistPost

	Id uuid.UUID `json:"id"`
}

type Checklist struct {
	*ChecklistWithoutItems

	ChecklistItems []ChecklistFormChecklistItemsInner `json:"checklistItems,omitempty"`
}

type ChecklistItemPatch struct {
	Title string `json:"title,omitempty"`
	Text  string `json:"text,omitempty"`
}

type ChecklistItemPost struct {
	ChecklistId string            `json:"checklistId"`
	Column      json.Number       `json:"column" type:"integer"`
	Page        json.Number       `json:"page" type:"integer"`
	Position    json.Number       `json:"position" type:"integer"`
	Type        ChecklistItemType `json:"type"`
	Title       string            `json:"title,omitempty"`
	Color       string            `json:"color,omitempty"`
	Text        string            `json:"text,omitempty"`
}

type ChecklistFormChecklistItemsInnerWithoutSubChecklistItems struct {
	*ChecklistItemPost

	Id uuid.UUID `json:"id"`
}
type ChecklistFormChecklistItemsInner struct {
	*ChecklistFormChecklistItemsInnerWithoutSubChecklistItems

	SubChecklistItems []SubChecklistFormSubChecklistItemsInner `json:"subChecklistItems"`
}

type ChecklistItemPositionPatch struct {
	Id       string      `json:"id"`
	Position json.Number `json:"position" type:"integer"`
}

type SubChecklistFormSubChecklistItemsInner struct {
	Id              string               `json:"id"`
	ChecklistItemId string               `json:"checklistItemId"`
	Type            SubChecklistItemType `json:"type"`
	Position        json.Number          `json:"position" type:"integer"`
	Item            string               `json:"item,omitempty"`
	Action          string               `json:"action,omitempty"`
	Text            string               `json:"text,omitempty"`
}

type SubChecklistItemPatch struct {
	Title  string `json:"title,omitempty"`
	Text   string `json:"text,omitempty"`
	Item   string `json:"item,omitempty"`
	Action string `json:"action,omitempty"`
}
