import { Component, computed, inject, input } from '@angular/core';

import { PageOrientation, PageSize } from '@api';
import { ChecklistPreviewComponent } from '@components';

import { AppStore } from '../../../../app.store';
import { IChecklistVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-editor',
    templateUrl: 'editor.component.html',
    standalone: true,
    imports: [ChecklistPreviewComponent],
})
export class EditorComponent {
    public readonly appStore = inject(AppStore);
    public readonly checklistId = input<string>('', { alias: 'id' });
    public readonly checklist = computed(() => {
        const checklist = this.appStore.currentChecklist();

        return checklist ?? ({} as IChecklistVM);
    });

    public pageSize: PageSize = PageSize.A4;
    public pageOrientation: PageOrientation = PageOrientation.Portrait;
}
