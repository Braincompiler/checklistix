import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { catchError, defer, exhaustMap, finalize, map, of, Subject } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { createReload } from '@utils/rxjs';
import { isNil } from 'ramda';

import { BorderThickness, Checklist, ChecklistsService, ChecklistStyle, PageOrientation, PageSize } from '@api/data';

import { AppStore } from '../../../../app.store';
import { checklistMapToVM, IChecklistVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-overview',
    templateUrl: 'overview.component.html',
    standalone: true,
    providers: [ConfirmationService],
    imports: [
        RouterLink, //
        AsyncPipe,
        DatePipe,
        JsonPipe,
        ConfirmDialogModule,
    ],
})
export class OverviewComponent {
    readonly #router = inject(Router);
    readonly #route = inject(ActivatedRoute);
    readonly #checklistsService = inject(ChecklistsService);
    readonly #appStore = inject(AppStore);
    readonly #destroyRef = inject(DestroyRef);
    readonly #messageService = inject(MessageService);
    readonly #confirmationService = inject(ConfirmationService);

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

    public onCopyChecklist(event: MouseEvent, checklist: IChecklistVM) {
        this.#confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Are you sure you want to copy the checklist ${checklist.title}?`,
            header: `Copy ${checklist.title}`,
            icon: 'pi pi-exclamation-triangle',
            closable: true,
            closeOnEscape: true,
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Yes',
            },
            accept: () => {
                defer(() => {
                    this.#appStore.startIsLoading();

                    return this.#checklistsService.checklistsIdCopyGet(checklist.id);
                })
                    .pipe(
                        takeUntilDestroyed(this.#destroyRef),
                        finalize(() => this.#appStore.stopIsLoading()),
                    )
                    .subscribe(async () => {
                        this.#messageService.add({
                            severity: 'success',
                            detail: 'Checklist copied successfully',
                            life: 3000,
                        });

                        this.#reloadSubject.next();
                    });
            },
            reject: () => {
                // console.log('rejected');
            },
        });
    }

    public async onPrintChecklist(checklist: IChecklistVM) {
        await this.#router.navigate(['my', 'checklists', checklist.id, 'viewer'], { queryParams: { print: 1 } });
    }

    public onDeleteChecklist(event: MouseEvent, checklist: IChecklistVM) {
        this.#confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Are you sure you want to delete the checklist ${checklist.title}?`,
            header: `Delete ${checklist.title}`,
            icon: 'pi pi-exclamation-triangle',
            closable: true,
            closeOnEscape: true,
            rejectButtonProps: {
                label: 'No',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Yes',
            },
            accept: () => {
                defer(() => {
                    this.#appStore.startIsLoading();

                    return this.#checklistsService.checklistsIdDelete(checklist.id);
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
            },
            reject: () => {
                // console.log('rejected');
            },
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
                // tap((d) => console.log(d)),
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
