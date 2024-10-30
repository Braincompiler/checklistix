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
	Title           string          `json:"title" db:"title" mapstructure:"title"`
	Created         time.Time       `json:"created" db:"created" mapstructure:"created"`
	Updated         time.Time       `json:"updated,omitempty" db:"updated" mapstructure:"updated"`
	Style           ChecklistStyle  `json:"style,omitempty" db:"style" mapstructure:"style"`
	PageSize        PageSize        `json:"pageSize,omitempty" db:"page_size" mapstructure:"pageSize"`
	PageOrientation PageOrientation `json:"pageOrientation,omitempty" db:"page_orientation" mapstructure:"pageOrientation"`
	Columns         json.Number     `json:"columns,omitempty" type:"integer" db:"columns" mapstructure:"columns"`
	FontSize        json.Number     `json:"fontSize,omitempty" type:"integer" db:"font_size" mapstructure:"fontSize"`
	BorderThickness json.Number     `json:"borderThickness,omitempty" type:"BorderThickness" db:"border_thickness" mapstructure:"borderThickness"`
	FontFamily      string          `json:"fontFamily,omitempty" db:"font_family" mapstructure:"fontFamily"`
	DefaultColor    string          `json:"defaultColor,omitempty" db:"default_color" mapstructure:"defaultColor"`
}

type ChecklistWithoutItems struct {
	*ChecklistPost

	Id uuid.UUID `json:"id" db:"id"`
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
	Id          string            `json:"id" db:"id"`
	ChecklistId string            `json:"checklistId" db:"checklist_id"`
	Column      json.Number       `json:"column" type:"integer" db:"column"`
	Page        json.Number       `json:"page" type:"integer" db:"page"`
	Position    json.Number       `json:"position" type:"integer" db:"position"`
	Type        ChecklistItemType `json:"type" db:"color"`
	Title       string            `json:"title,omitempty" db:"title"`
	Color       string            `json:"color,omitempty" db:"color"`
	Text        string            `json:"text,omitempty" db:"text"`
}

type ChecklistFormChecklistItemsInner struct {
	*ChecklistItemPost
	SubChecklistItems []SubChecklistFormSubChecklistItemsInner `json:"subChecklistItems"`
}

type SubChecklistFormSubChecklistItemsInner struct {
	Id             string               `json:"id" db:"id"`
	SubChecklistId string               `json:"subChecklistId" db:"sub_checklist_id"`
	Type           SubChecklistItemType `json:"type" db:"type"`
	Position       json.Number          `json:"position" type:"integer" db:"position"`
	Item           string               `json:"item,omitempty" db:"item"`
	Action         string               `json:"action,omitempty" db:"action"`
	Text           string               `json:"text,omitempty" db:"text"`
}

type SubChecklistItemPatch struct {
	Title  string `json:"title,omitempty"`
	Text   string `json:"text,omitempty"`
	Item   string `json:"item,omitempty"`
	Action string `json:"action,omitempty"`
}
