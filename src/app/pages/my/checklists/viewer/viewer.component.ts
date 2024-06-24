import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ChecklistPreviewComponent } from '@components';

import { AppStore } from '../../../../app.store';
import { IChecklistVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-viewer',
    templateUrl: 'viewer.component.html',
    standalone: true,
    imports: [
        ChecklistPreviewComponent, //
        RouterLink,
    ],
})
export class ViewerComponent {
    readonly #appStore = inject(AppStore);

    public readonly checklistId = input.required<string>({ alias: 'id' });
    public readonly checklist = computed(() => this.#appStore.currentChecklist() ?? ({} as IChecklistVM));

    public constructor() {
        effect(
            () => this.#appStore.loadById(this.checklistId()), //
            { allowSignalWrites: true },
        );
    }
}
