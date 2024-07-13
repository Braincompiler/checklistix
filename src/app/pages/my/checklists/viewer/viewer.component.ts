import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ChecklistPreviewComponent } from '@components';

import { AppStore } from '../../../../app.store';
import { IChecklistVM } from '../../../../mapper';
import { PrintService } from '../../../../services/print.service';

@Component({
    selector: 'cx-checklists-viewer',
    templateUrl: 'viewer.component.html',
    standalone: true,
    imports: [
        ChecklistPreviewComponent, //
        RouterLink,
    ],
    providers: [PrintService],
})
export class ViewerComponent {
    readonly #appStore = inject(AppStore);
    readonly #printService = inject(PrintService);

    public readonly checklistId = input.required<string>({ alias: 'id' });
    public readonly checklist = computed(() => this.#appStore.currentChecklist() ?? ({} as IChecklistVM));

    public constructor() {
        effect(
            () => this.#appStore.loadById(this.checklistId()), //
            { allowSignalWrites: true },
        );
    }

    public async print() {
        await this.#printService.print(this.checklist());
    }
}
