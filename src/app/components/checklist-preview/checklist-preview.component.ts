import { NgClass } from '@angular/common';
import { booleanAttribute, Component, computed, input, NO_ERRORS_SCHEMA } from '@angular/core';

import { ChecklistItemType, PageOrientation, PageSize, SubChecklistItemType } from '@api';

import { IChecklistVM } from '../../mapper';

const COLUMNS_CSS_CLASSES: Record<number, string> = {
    1: 'columns-1',
    2: 'columns-2',
    3: 'columns-3',
    4: 'columns-4',
    5: 'columns-5',
    6: 'columns-6',
    7: 'columns-7',
};

const OUTLINE_CSS_CLASSES: Record<number, string> = {
    0: 'outline-0',
    1: 'outline-1',
    2: 'outline-2',
    4: 'outline-4',
    8: 'outline-8',
};

const BORDER_B_CSS_CLASSES: Record<number, string> = {
    0: 'border-b-0',
    1: 'border-b-1',
    2: 'border-b-2',
    4: 'border-b-4',
    8: 'border-b-8',
};

@Component({
    selector: 'cx-checklist-preview',
    templateUrl: 'checklist-preview.component.html',
    standalone: true,
    schemas: [NO_ERRORS_SCHEMA],
    imports: [NgClass],
})
export class ChecklistPreviewComponent {
    public readonly checklist = input.required<IChecklistVM>();
    public readonly pageSize = input.required<PageSize>();
    public readonly pageOrientation = input.required<PageOrientation>();
    public readonly isEdit = input(false, { transform: (v) => booleanAttribute(v) });

    public readonly columnCssClass = computed(() => COLUMNS_CSS_CLASSES[this.checklist().columns ?? 2]);
    public readonly outlineCssClass = computed(() => OUTLINE_CSS_CLASSES[this.checklist().borderThickness ?? 2]);
    public readonly borderBCssClass = computed(() => BORDER_B_CSS_CLASSES[this.checklist().borderThickness ?? 2]);
    public readonly checklistStyleCssClass = computed(() => this.checklist().style?.toLowerCase());

    protected readonly ChecklistItemType = ChecklistItemType;
    protected readonly SubChecklistItemType = SubChecklistItemType;
}
