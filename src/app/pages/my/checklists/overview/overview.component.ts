import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { catchError, defer, exhaustMap, finalize, map, of, Subject, tap } from 'rxjs';

import { MessageService } from 'primeng/api';

import { createReload } from '@utils/rxjs';
import { isNil } from 'ramda';

import { BorderThickness, Checklist, ChecklistsService, ChecklistStyle, PageOrientation, PageSize } from '@api/data';

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
        JsonPipe,
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
    // readonly #responsesSubject$ = new BehaviorSubject<string[]>([]);

    public readonly checklists$ = createReload(this.#reloadSubject).pipe(
        exhaustMap(() =>
            this.#checklistsService.checklistsGet().pipe(
                // tap((d) => console.log(d)),
                map((checklists) => (checklists ?? []).map(checklistMapToVM)),
            ),
        ),
    );

    // public readonly responses = toSignal(this.#responsesSubject$.asObservable());

    public constructor() {
        // this.#wsService.response$
        //     .pipe(takeUntilDestroyed(this.#destroyRef))
        //     .subscribe((response) => this.#responsesSubject$.next([...this.#responsesSubject$.value, response]));
    }

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
                // checklistItems: [],
                title: 'My Checklist',
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
                catchError((e) => {
                    console.error(e);

                    this.#messageService.add({
                        severity: 'error',
                        summary: 'Error while creating new checklist',
                        detail: e.error,
                        life: 3000,
                    });

                    return of(null);
                }),
                tap((d) => console.log(d)),
            )
            .subscribe(async (justCreatedChecklist: Checklist | null) => {
                if (!isNil(justCreatedChecklist)) {
                    this.#messageService.add({
                        severity: 'success',
                        detail: 'Checklist created successfully. Have fun with editing :)',
                        life: 3000,
                    });

                    await this.#router.navigate(['.', justCreatedChecklist.id, 'editor'], { relativeTo: this.#route });
                }
            });
    }
}
