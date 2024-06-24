import type { components } from './api.d';

export type Checklist = components['schemas']['Checklist'];
export type ChecklistForm = components['schemas']['ChecklistForm'];

export type SubChecklist = components['schemas']['SubChecklist'];
export type SubChecklistForm = components['schemas']['SubChecklistForm'];
export type SubChecklistItemCheckItem = components['schemas']['SubChecklistItemCheckItem'];
export type SubChecklistItemCheckItemForm = components['schemas']['SubChecklistItemCheckItemForm'];
export type SubChecklistItemPrecondition = components['schemas']['SubChecklistItemPrecondition'];
export type SubChecklistItemPreconditionForm = components['schemas']['SubChecklistItemPreconditionForm'];
export type SubChecklistItemPostcondition = components['schemas']['SubChecklistItemPostcondition'];
export type SubChecklistItemPostconditionForm = components['schemas']['SubChecklistItemPostconditionForm'];
export type SubChecklistItemSubtitle = components['schemas']['SubChecklistItemSubtitle'];
export type SubChecklistItemSubtitleForm = components['schemas']['SubChecklistItemSubtitleForm'];

export type TextBox = components['schemas']['TextBox'];
export type TextBoxForm = components['schemas']['TextBoxForm'];

// export type ColumnBreak = components['schemas']['ColumnBreak'];
// export type ColumnBreakForm = components['schemas']['ColumnBreakForm'];
//
// export type PageBreak = components['schemas']['PageBreak'];
// export type PageBreakForm = components['schemas']['PageBreakForm'];

export type SectionTitle = components['schemas']['SectionTitle'];
export type SectionTitleForm = components['schemas']['SectionTitleForm'];

export interface ChecklistOverviewItem extends Pick<Checklist, 'id' | 'title' | 'created' | 'updated'> {}
