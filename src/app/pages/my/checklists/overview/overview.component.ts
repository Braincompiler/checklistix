import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { defer, exhaustMap, finalize, map, Subject } from 'rxjs';

import { MessageService } from 'primeng/api';

import { createReload } from '@utils/rxjs';

import { BorderThickness, ChecklistsService, ChecklistStyle, PageOrientation, PageSize } from '@api';

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
    readonly #route = inject(ActivatedRoute);
    readonly #checklistsService = inject(ChecklistsService);
    readonly #appStore = inject(AppStore);
    readonly #destroyRef = inject(DestroyRef);
    readonly #messageService = inject(MessageService);

    readonly #reloadSubject = new Subject<void>();

    public readonly checklists$ = createReload(this.#reloadSubject).pipe(
        exhaustMap(() => this.#checklistsService.checklistsGet().pipe(map((checklists) => checklists.map(checklistMapToVM)))),
    );

    public async onOpenChecklist(id?: string, component?: string) {
        await this.#router.navigate(['my', 'checklists', id, component]);
    }

    public onCopyChecklist(id?: string) {
        console.log('copy checklist', id);
    }

    public onPrintChecklist(id?: string) {
        console.log('print checklist', id);
    }

    public onDeleteChecklist(id: string) {
        console.log('delete checklist', id);

        defer(() => {
            this.#appStore.startIsLoading();

            return this.#checklistsService.checklistsIdDelete(id);
        })
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                finalize(() => this.#appStore.stopIsLoading()),
            )
            .subscribe(async () => {
                this.#messageService.add({
                    severity: 'success',
                    detail: 'Checklist deleted successfully',
                    life: 3000,
                });

                this.#reloadSubject.next();
            });
    }

    public onNewChecklist() {
        defer(() => {
            this.#appStore.startIsLoading();

            return this.#checklistsService.checklistsPost({
                checklistItems: [],
                borderThickness: BorderThickness.Medium,
                columns: 2,
                created: new Date().toISOString(),
                defaultColor: '#d4d4d4',
                fontFamily: 'sans-serif',
                fontSize: 10,
                pageOrientation: PageOrientation.Portrait,
                pageSize: PageSize.A4,
                style: ChecklistStyle.Dots,
            });
        })
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                finalize(() => this.#appStore.stopIsLoading()),
            )
            .subscribe(async (justCreatedChecklist) => {
                this.#messageService.add({
                    severity: 'success',
                    detail: 'Checklist created successfully. Have fun with the editing :)',
                    life: 3000,
                });

                await this.#router.navigate(['.', justCreatedChecklist.id, 'editor'], { relativeTo: this.#route });
            });
    }
}
