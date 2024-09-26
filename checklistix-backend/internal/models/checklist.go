package models

import (
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

type Checklist struct {
	Id              uuid.UUID                          `json:"id" db:"id"`
	Title           string                             `json:"title" db:"title"`
	Created         time.Time                          `json:"created" db:"created"`
	Updated         time.Time                          `json:"updated,omitempty" db:"updated"`
	Style           ChecklistStyle                     `json:"style,omitempty" db:"style"`
	PageSize        PageSize                           `json:"pageSize,omitempty" db:"page_size"`
	PageOrientation PageOrientation                    `json:"pageOrientation,omitempty" db:"page_orientation"`
	Columns         int                                `json:"columns,omitempty" db:"columns"`
	FontSize        int                                `json:"fontSize,omitempty" db:"font_size"`
	BorderThickness BorderThickness                    `json:"borderThickness,omitempty" db:"border_thickness"`
	FontFamily      string                             `json:"fontFamily,omitempty" db:"font_family"`
	DefaultColor    string                             `json:"defaultColor,omitempty" db:"default_color"`
	ChecklistItems  []ChecklistFormChecklistItemsInner `json:"checklistItems,omitempty"`
}

type ChecklistFormChecklistItemsInner struct {
	Id                string                                   `json:"id" db:"id"`
	ChecklistId       string                                   `json:"checklistId" db:"checklist_id"`
	Column            int                                      `json:"column" db:"column"`
	Page              int                                      `json:"page" db:"page"`
	Position          int                                      `json:"position" db:"position"`
	Type              ChecklistItemType                        `json:"type" db:"color"`
	Title             string                                   `json:"title,omitempty" db:"title"`
	Color             string                                   `json:"color,omitempty" db:"color"`
	Text              string                                   `json:"text,omitempty" db:"text"`
	SubChecklistItems []SubChecklistFormSubChecklistItemsInner `json:"subChecklistItems,omitempty"`
}

type SubChecklistFormSubChecklistItemsInner struct {
	Id             string               `json:"id" db:"id"`
	SubChecklistId string               `json:"subChecklistId" db:"sub_checklist_id"`
	Type           SubChecklistItemType `json:"type" db:"type"`
	Position       int                  `json:"position" db:"position"`
	Item           string               `json:"item,omitempty" db:"item"`
	Action         string               `json:"action,omitempty" db:"action"`
	Text           string               `json:"text,omitempty" db:"text"`
}
