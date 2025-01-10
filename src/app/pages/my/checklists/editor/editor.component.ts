import { Component, computed, DestroyRef, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { isDualpropUpdate, isPropUpdate, pickAll } from '@utils';
import { isDate } from 'date-fns';
import { isNil, omit } from 'ramda';

import { ChecklistForm, ChecklistFormChecklistItemsInner, ChecklistsService, SubChecklistFormSubChecklistItemsInner } from '@api/data';
import { ChecklistPreviewComponent, IDualPropUpdate, IPropUpdate } from '@components';

import { AppStore } from '../../../../app.store';
import { IChecklistVM } from '../../../../mapper';

@Component({
    selector: 'cx-checklists-editor',
    templateUrl: 'editor.component.html',
    standalone: true,
    imports: [ChecklistPreviewComponent, RouterLink],
    // providers: [WsService],
})
export class EditorComponent {
    readonly #appStore = inject(AppStore);
    readonly #checklistsService = inject(ChecklistsService);
    readonly #destroyRef = inject(DestroyRef);
    // readonly #wsService = inject(WsService);

    public readonly checklistId = input<string>('', { alias: 'id' });
    public readonly checklist = computed(() => this.#appStore.currentChecklist() ?? ({} as IChecklistVM));
    // public readonly isWsOnline = toSignal(this.#wsService.isOnline$);

    public constructor() {
        effect(() => this.#appStore.loadById(this.checklistId()));
    }

    public onChecklistUpdate(updatedChecklist: Partial<ChecklistForm>): void {
        if (!isDate(this.checklist().created)) {
            console.log('created not a date');
            return;
        }

        // this.#wsService.updateChecklist(omit(['checklistItems'], this.checklist()));

        this.#checklistsService
            .checklistsIdPatch(this.checklistId(), {
                ...omit(['checklistItems'], this.checklist()),
                created: this.checklist().created.toISOString(),
                updated: this.checklist().updated?.toISOString(),
                ...updatedChecklist,
            })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onAddChecklistItem(newChecklistItem: Partial<ChecklistFormChecklistItemsInner>): void {
        this.#checklistsService
            .checklistsIdChecklistItemsPost(this.checklistId(), {
                // ...(newChecklistItem as any), // 🤨
                ...omit(['subChecklistItems'], newChecklistItem),
            })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onUpdateChecklistItem(updateData: IPropUpdate): void {
        this.#checklistsService
            .checklistItemsIdPatch(updateData.id, {
                [updateData.prop]: updateData.value,
            })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onAddSubChecklistItem(newSubChecklistItem: Partial<SubChecklistFormSubChecklistItemsInner>): void {
        this.#checklistsService
            .checklistItemsIdSubChecklistItemsPost(newSubChecklistItem.checklistItemId!, {
                ...(newSubChecklistItem as any), // 🤨
            })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onUpdateSubChecklistItem(updatedSubChecklistItem: IPropUpdate | IDualPropUpdate): void {
        let updateData;
        if (isDualpropUpdate(updatedSubChecklistItem)) {
            updateData = {
                [updatedSubChecklistItem.leftProp]: updatedSubChecklistItem.leftValue,
                [updatedSubChecklistItem.rightProp]: updatedSubChecklistItem.rightValue,
            };
        } else if (isPropUpdate(updatedSubChecklistItem)) {
            updateData = {
                [updatedSubChecklistItem.prop]: updatedSubChecklistItem.value,
            };
        }

        if (!isNil(updateData)) {
            this.#checklistsService
                .subChecklistItemsIdPatch(updatedSubChecklistItem.id, updateData) //
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe();
        }
    }

    public onUpdateChecklistItemPosition(checklistItems: ChecklistFormChecklistItemsInner[]): void {
        this.#checklistsService
            .checklistItemsPositionsPatch(pickAll(['position', 'id'], checklistItems)) //
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onUpdateSubChecklistItemsPosition(subChecklistItems: SubChecklistFormSubChecklistItemsInner[]): void {
        this.#checklistsService
            .subChecklistItemsPositionsPatch(pickAll(['position', 'id'], subChecklistItems)) //
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onDeleteChecklistItem(checklistItem: ChecklistFormChecklistItemsInner): void {
        this.#checklistsService
            .checklistItemsIdDelete(checklistItem.id) //
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }

    public onDeleteSubChecklistItem(subChecklistItem: SubChecklistFormSubChecklistItemsInner): void {
        this.#checklistsService
            .deleteSubChecklistItem(subChecklistItem.id) //
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }
}
