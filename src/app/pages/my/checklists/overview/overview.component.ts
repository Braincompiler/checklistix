import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { map } from 'rxjs';

import { ChecklistsService } from '@api';

import { AppStore } from '../../../../app.store';
import { checklistMapToVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-overview',
    templateUrl: 'overview.component.html',
    standalone: true,
    imports: [
        RouterLink, //
        AsyncPipe,
        DatePipe,
    ],
})
export class OverviewComponent {
    readonly #router = inject(Router);
    readonly #appStore = inject(AppStore);
    readonly #checklistsService = inject(ChecklistsService);

    public readonly checklists$ = this.#checklistsService.checklistsGet().pipe(map((checklists) => checklists.map(checklistMapToVM)));

    public async onOpenChecklist(id?: string, component?: string) {
        this.#appStore.loadById(id!);

        await this.#router.navigate(['my', 'checklists', id, component]);
    }

    public onCopyChecklist(id?: string) {
        console.log('copy checklist', id);
    }

    public onPrintChecklist(id?: string) {
        console.log('print checklist', id);
    }

    public onDeleteChecklist(id?: string) {
        console.log('delete checklist', id);
    }
}
