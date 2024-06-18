import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { map } from 'rxjs';

import { ChecklistsService, PageOrientation, PageSize } from '@api';
import { ChecklistPreviewComponent } from '@components';

import { checklistMapToVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-viewer',
    templateUrl: 'viewer.component.html',
    standalone: true,
    imports: [FormsModule, ChecklistPreviewComponent, AsyncPipe],
})
export class ViewerComponent {
    readonly #checklistsService = inject(ChecklistsService);

    public readonly checklistId = input<string>('', { alias: 'id' });
    public readonly checklist$ = computed(() =>
        this.#checklistsService
            .checklistsIdGet(this.checklistId()) //
            .pipe(map((checklist) => checklistMapToVM(checklist))),
    );

    public pageSize: PageSize = PageSize.A4;
    public pageOrientation: PageOrientation = PageOrientation.Portrait;
}
