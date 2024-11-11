import { Component, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { injectQueryParams } from 'ngxtension/inject-query-params';
import { isNil } from 'ramda';

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
    readonly #router = inject(Router);
    readonly #queryParams = injectQueryParams('print');

    public readonly checklistId = input.required<string>({ alias: 'id' });
    public readonly checklist = computed(() => this.#appStore.currentChecklist() ?? ({} as IChecklistVM));
    public readonly checklistLoadedProperlyForPrint = computed(() => !isNil(this.checklist().pageSize) && !isNil(this.checklist().pageOrientation));

    public constructor() {
        effect(
            () => this.#appStore.loadById(this.checklistId()), //
            { allowSignalWrites: true },
        );

        effect(async () => {
            const qp = this.#queryParams();
            if (qp === '1' && this.checklistLoadedProperlyForPrint()) {
                await this.print(true);
            }
        });
    }

    public async print(returnToList = false) {
        await this.#printService.print(this.checklist());

        if (returnToList) {
            await this.#router.navigate(['my', 'checklists'], { replaceUrl: true });
        }
    }
}
