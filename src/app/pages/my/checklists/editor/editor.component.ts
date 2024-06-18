import { AsyncPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';

import { map } from 'rxjs';

import { ChecklistsService, PageOrientation, PageSize } from '@api';
import { ChecklistPreviewComponent } from '@components';

import { checklistMapToVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-editor',
    templateUrl: 'editor.component.html',
    standalone: true,
    imports: [ChecklistPreviewComponent, AsyncPipe],
})
export class EditorComponent {
    readonly #checklistsService = inject(ChecklistsService);

    public readonly checklistId = input.required<string>({ alias: 'id' });
    public readonly checklist$ = computed(() =>
        this.#checklistsService
            .checklistsIdGet(this.checklistId()) //
            .pipe(map((checklist) => checklistMapToVM(checklist))),
    );

    public pageSize: PageSize = PageSize.A4;
    public pageOrientation: PageOrientation = PageOrientation.Portrait;
}
