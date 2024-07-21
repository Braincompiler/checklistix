import {
    CdkDrag,
    CdkDragDrop,
    CdkDragHandle,
    CdkDragPlaceholder,
    CdkDropList,
    CdkDropListGroup,
    moveItemInArray,
    transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DOCUMENT, NgClass } from '@angular/common';
import {
    AfterViewInit,
    booleanAttribute,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    model,
    NO_ERRORS_SCHEMA,
    output,
    signal,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { debounceTime } from 'rxjs';

import { MenuItem, MenuItemCommandEvent } from 'primeng/api';

import { isChecklistItem, isSubChecklistItem } from '@utils';
import { ascend, clone, compose, isNil, prop, range, sortBy, toLower } from 'ramda';
import { v4 as uuidv4 } from 'uuid';

import {
    BorderThickness,
    ChecklistForm,
    ChecklistFormChecklistItemsInner,
    ChecklistItemType,
    ChecklistStyle,
    PageOrientation,
    PageSize,
    SubChecklistFormSubChecklistItemsInner,
    SubChecklistItemType,
} from '@api';
import { Add2menuitemPipe } from '@pipes';

import { IChecklistVM } from '../../mapper';
import { DualInputEditComponent } from '../dual-input-edit/dual-input-edit.component';
import { EditorInputComponent } from '../editor-input/editor-input.component';
import { EditorSelectComponent } from '../editor-select/editor-select.component';
import { MultiLineEditComponent } from '../multi-line-edit/multi-line-edit.component';
import { SingleLineEditComponent } from '../single-line-edit/single-line-edit.component';
import { SubchecklistMenuButtonComponent } from '../subchecklist-menu-button/subchecklist-menu-button.component';

export const sortByPageAsc = ascend<IChecklistPage>(prop('page'));
export const sortByPositionAsc = ascend<ChecklistFormChecklistItemsInner>(prop('position'));
export const sortByColumnAsc = ascend<IChecklistColumn>(prop('column'));

export interface IChecklistColumn {
    column: number;
    numChecklistItems: number;
    checklistItems: ChecklistFormChecklistItemsInner[];
    checklistItemsSortedByPosition: ChecklistFormChecklistItemsInner[];
}

export interface IChecklistPage {
    page: number;
    numColumns: number;
    checklist: IChecklistVM;
    columns: IChecklistColumn[];
    columnsSortedByColumn: IChecklistColumn[];

    getOrAddColumn(column: number): IChecklistColumn;

    getColumn(column: number): IChecklistColumn | null;
}

export interface IPaginatedChecklist {
    numPages: number;
    pages: IChecklistPage[];
    pagesSortedByPage: IChecklistPage[];

    getOrAddPage(page: number, checklist: IChecklistVM): IChecklistPage;

    getPage(page: number): IChecklistPage | null;
}

export class PaginatedChecklist implements IPaginatedChecklist {
    public get numPages(): number {
        return this.pages.length;
    }

    public get pagesSortedByPage(): IChecklistPage[] {
        return this.pages.sort(sortByPageAsc);
    }

    public constructor(public readonly pages: IChecklistPage[] = []) {}

    public getPage(page: number): IChecklistPage | null {
        return this.pages[page] ?? null;
    }

    public getOrAddPage(page: number, checklist: IChecklistVM): IChecklistPage {
        if (page >= this.numPages) {
            this.#addPagesUntil(page, checklist);
        }

        return this.pages[page]!;
    }

    #addPagesUntil(page: number, checklist: IChecklistVM) {
        let currentMaxIndex = this.numPages - 1;
        while (currentMaxIndex < page) {
            this.pages.push(new ChecklistPage(page, checklist));
            currentMaxIndex++;
        }
    }
}

export class ChecklistPage implements IChecklistPage {
    public get numColumns(): number {
        return this.columns.length;
    }

    public get columnsSortedByColumn(): IChecklistColumn[] {
        return this.columns.sort(sortByColumnAsc);
    }

    public constructor(
        public readonly page: number, //
        public readonly checklist: IChecklistVM,
        public readonly columns: IChecklistColumn[] = [
            // Ensure at least num of columns as configured to allow to render at least the "add"-Button
            ...range(0, checklist.columns ?? 0).map((column) => new ChecklistColumn(column)),
        ],
    ) {}

    public getColumn(column: number): IChecklistColumn | null {
        return this.columns[column] ?? null;
    }

    public getOrAddColumn(column: number): IChecklistColumn {
        if (column >= this.numColumns) {
            this.#addColumnsUntil(column);
        }

        return this.columns[column]!;
    }

    #addColumnsUntil(column: number) {
        let currentMaxIndex = this.numColumns - 1;
        while (currentMaxIndex < column) {
            this.columns.push(new ChecklistColumn(column));
            currentMaxIndex++;
        }
    }
}

export class ChecklistColumn implements IChecklistColumn {
    public get numChecklistItems(): number {
        return this.checklistItems.length;
    }

    public get checklistItemsSortedByPosition(): ChecklistFormChecklistItemsInner[] {
        return this.checklistItems.sort(sortByPositionAsc);
    }

    public constructor(
        public readonly column: number, //
        public readonly checklistItems: ChecklistFormChecklistItemsInner[] = [],
    ) {}
}

export interface IPropUpdate {
    prop: string;
    value: any;
    id: string;
}

export interface IDualPropUpdate {
    leftProp: string;
    rightProp: string;
    leftValue: any;
    rightValue: any;
    id: string;
}

const COLUMNS_CSS_CLASSES: Record<number, string> = {
    1: 'columns-1',
    2: 'columns-2',
    3: 'columns-3',
    4: 'columns-4',
    5: 'columns-5',
    6: 'columns-6',
    7: 'columns-7',
};

const FONT_SIZE_CSS_CLASSES: Record<number, string> = {
    8: 'fs8',
    9: 'fs9',
    10: 'fs10',
    11: 'fs11',
    12: 'fs12',
};

const BORDER_CSS_CLASSES: Record<number, string> = {
    0: 'border-0',
    1: 'border-1',
    2: 'border-2',
    4: 'border-4',
    8: 'border-8',
};

const BORDER_B_CSS_CLASSES: Record<number, string> = {
    0: 'border-b-0',
    1: 'border-b-1',
    2: 'border-b-2',
    4: 'border-b-4',
    8: 'border-b-8',
};

declare global {
    interface Window {
        HSAccordion: any;
    }
}

const sortByStringValueCaseInsensitive = sortBy(compose(toLower, prop('value')));
const sortByNumberValue = sortBy(compose((s: string) => parseInt(s, 10), prop('value')));
const sortByNumberKey = sortBy(compose((s: string) => parseInt(s, 10), prop('key')));

@Component({
    selector: 'cx-checklist-preview',
    templateUrl: 'checklist-preview.component.html',
    standalone: true,
    schemas: [NO_ERRORS_SCHEMA],
    imports: [
        NgClass, //
        SubchecklistMenuButtonComponent,
        CdkDropList,
        CdkDrag,
        CdkDragHandle,
        CdkDropListGroup,
        CdkDragPlaceholder,
        FormsModule,
        SingleLineEditComponent,
        MultiLineEditComponent,
        DualInputEditComponent,
        Add2menuitemPipe,
        EditorSelectComponent,
        EditorInputComponent,
        ReactiveFormsModule,
    ],
})
export class ChecklistPreviewComponent implements AfterViewInit {
    readonly #document = inject(DOCUMENT);
    readonly #fb = inject(FormBuilder);

    @ViewChild('accordionNode', { static: false })
    public readonly accordionNode!: ElementRef;

    public readonly checklist = model.required<IChecklistVM>();
    public readonly isEdit = input(false, { transform: (v) => booleanAttribute(v) });

    public readonly updateChecklist = output<Partial<ChecklistForm>>();
    public readonly addChecklistItem = output<Partial<ChecklistFormChecklistItemsInner>>();
    public readonly updateChecklistItem = output<IPropUpdate>();
    public readonly addSubChecklistItem = output<Partial<SubChecklistFormSubChecklistItemsInner>>();
    public readonly updateSubChecklistItem = output<IPropUpdate | IDualPropUpdate>();
    public readonly updateChecklistItemPosition = output<ChecklistFormChecklistItemsInner[]>();
    public readonly updateSubChecklistItemsPosition = output<SubChecklistFormSubChecklistItemsInner[]>();

    public readonly subChecklistItemInEditMode = signal<boolean>(false);
    public readonly fontSizeCssClass = computed(() => FONT_SIZE_CSS_CLASSES[this.checklist().fontSize ?? 10]);
    public readonly columnCssClass = computed(() => COLUMNS_CSS_CLASSES[this.checklist().columns ?? 2]);
    public readonly outlineCssClass = computed(() => BORDER_CSS_CLASSES[this.checklist().borderThickness ?? 2]);
    public readonly borderBCssClass = computed(() => BORDER_B_CSS_CLASSES[this.checklist().borderThickness ?? 2]);
    public readonly checklistStyleCssClass = computed(() => this.checklist().style?.toLowerCase());
    public readonly paginatedChecklist = computed<IPaginatedChecklist>(() => {
        const checklist = this.checklist();
        if (isNil(checklist.checklistItems)) {
            return new PaginatedChecklist([new ChecklistPage(0, checklist)]);
        }

        // @TODO: Is there any optimization possible? 🤔
        const checklistItems = clone(checklist.checklistItems);
        const checklistClone = clone(checklist);

        checklistClone.checklistItems = [];

        const paginatedChecklist = new PaginatedChecklist([new ChecklistPage(0, checklistClone)]);

        checklistItems.forEach((checklistItem) => {
            const page = paginatedChecklist.getOrAddPage(checklistItem.page, clone(checklistClone));
            const column = page.getOrAddColumn(checklistItem.column);

            column.checklistItems.push(checklistItem);
        });

        return paginatedChecklist;
    });

    protected readonly ChecklistItemType = ChecklistItemType;
    protected readonly SubChecklistItemType = SubChecklistItemType;

    protected readonly checklistStyles = this.mapToSelectOptions(ChecklistStyle, sortByStringValueCaseInsensitive);
    protected readonly pageSizes = this.mapToSelectOptions(PageSize, sortByStringValueCaseInsensitive);
    protected readonly pageOrientations = this.mapToSelectOptions(PageOrientation, sortByStringValueCaseInsensitive);
    protected readonly borderThicknesses = this.mapToSelectOptions(BorderThickness, sortByNumberKey, true);
    protected readonly columns = this.mapToSelectOptions(this.makeObject([2, 3, 4]), sortByNumberValue);
    protected readonly fontSizes = this.mapToSelectOptions(this.makeObject([8, 9, 10, 11, 12], ' pt'), sortByNumberKey);
    protected readonly fontFamilies = this.mapToSelectOptions(this.makeObject(['sans-serif', 'serif']), sortByStringValueCaseInsensitive);

    public readonly checklistMenuItems: MenuItem[] = [
        {
            label: 'Checklist',
            command: (event: MenuItemCommandEvent) => this.addChecklist(event),
        },
        {
            label: 'SectionTitle',
            command: (event: MenuItemCommandEvent) => this.addSectionTitle(event),
        },
        {
            label: 'Textbox',
            command: (event: MenuItemCommandEvent) => this.addTextbox(event),
        },
    ];
    public readonly subChecklistMenuItems: MenuItem[] = [
        {
            label: 'Check item',
            command: (event: MenuItemCommandEvent) => this.addCheckItem(event),
        },
        {
            label: 'Subtitle',
            command: (event: MenuItemCommandEvent) => this.addSubtitle(event),
        },
        {
            label: 'Precondition',
            command: (event: MenuItemCommandEvent) => this.addPrecondition(event),
        },
        {
            label: 'Postcondition',
            command: (event: MenuItemCommandEvent) => this.addPostcondition(event),
        },
        {
            label: 'Left Hand Text',
            command: (event: MenuItemCommandEvent) => this.addText(event, 'left'),
        },
        {
            label: 'Right Hand Text',
            command: (event: MenuItemCommandEvent) => this.addText(event, 'right'),
        },
    ];

    public readonly metaDataForm = this.#fb.group({
        title: this.#fb.nonNullable.control(''),
        style: this.#fb.nonNullable.control(ChecklistStyle.Dots),
        pageSize: this.#fb.nonNullable.control(PageSize.A4),
        pageOrientation: this.#fb.nonNullable.control(PageOrientation.Portrait),
        columns: this.#fb.nonNullable.control(2),
        borderThickness: this.#fb.nonNullable.control(BorderThickness.Medium),
        fontSize: this.#fb.nonNullable.control(10),
        fontFamily: this.#fb.nonNullable.control('sans-serif'),
        defaultColor: this.#fb.nonNullable.control('#d4d4d4'),
    });

    public constructor() {
        effect(() => this.metaDataForm.patchValue(this.checklist(), { emitEvent: false }));

        this.metaDataForm.valueChanges //
            .pipe(debounceTime(250))
            .subscribe((d) => {
                this.checklist.update((checklist) => ({
                    ...checklist,
                    title: d.title,
                    style: d.style ?? ChecklistStyle.Dots,
                    pageSize: d.pageSize ?? PageSize.A4,
                    pageOrientation: d.pageOrientation ?? PageOrientation.Portrait,
                    columns: parseInt((d.columns as any) ?? 2, 10),
                    borderThickness: d.borderThickness ?? BorderThickness.Medium,
                    fontSize: parseInt((d.fontSize as any) ?? 10, 10),
                    fontFamily: d.fontFamily ?? 'sans-serif',
                    defaultColor: d.defaultColor ?? '#d4d4d4',
                }));
                this.updateChecklist.emit(d);
            });
    }

    public ngAfterViewInit(): void {
        // console.log(this.accordionNode, this.#doc.defaultView?.HSAccordion);
        // if (this.isEdit()) {
        //     setTimeout(() => {
        //         const HSAccordion = this.#doc.defaultView!.HSAccordion;
        //         const accordion = new HSAccordion(this.accordionNode.nativeElement);
        //
        //         accordion.hide();
        //     }, 3000);
        // }
    }

    public onDragStarted(): void {
        this.#document?.body?.classList.add('!cursor-grabbing');
    }

    public drop($event: CdkDragDrop<any, any>, page: number, column: number) {
        this.#document?.body?.classList.remove('!cursor-grabbing');

        let checklistItems = this.checklist().checklistItems!;

        // console.log({ $event, page, column, checklistItems });
        if ($event.previousContainer === $event.container) {
            const checklistColumn = this.paginatedChecklist().getPage(page)?.getColumn(column)!;

            moveItemInArray(
                checklistColumn.checklistItems, //
                $event.previousIndex,
                $event.currentIndex,
            );

            checklistColumn.checklistItems = checklistColumn.checklistItems.map((c, i) => ({ ...c, position: i }));
            checklistItems = checklistItems.map((c) => checklistColumn.checklistItems.find((i) => i.id === c.id) || c);
        } else {
            const { page: srcPage, column: srcColumn } = $event.item.data;
            const srcChecklistColumn = this.paginatedChecklist().getPage(srcPage)?.getColumn(srcColumn)!;
            const targetChecklistColumn = this.paginatedChecklist().getPage(page)?.getColumn(column)!;

            transferArrayItem(
                srcChecklistColumn.checklistItems, //
                targetChecklistColumn.checklistItems,
                $event.previousIndex,
                $event.currentIndex,
            );

            srcChecklistColumn.checklistItems = srcChecklistColumn.checklistItems.map((c, i) => ({ ...c, position: i }));
            targetChecklistColumn.checklistItems = targetChecklistColumn.checklistItems.map((c, i) => ({ ...c, position: i, page, column }));
            checklistItems = checklistItems.map(
                (c) =>
                    srcChecklistColumn.checklistItems.find((i) => i.id === c.id) || //
                    targetChecklistColumn.checklistItems.find((i) => i.id === c.id) ||
                    c,
            );

            // console.log(
            //     srcChecklistColumn.checklistItems, //
            //     targetChecklistColumn.checklistItems,
            //     checklistItems,
            // );
        }

        this.updateChecklistItemPosition.emit(checklistItems);
        this.checklist.update((checklist) => ({ ...checklist, checklistItems }));
    }

    public onExitEditMode(checklistItem: ChecklistFormChecklistItemsInner, prop: keyof ChecklistFormChecklistItemsInner): void;
    public onExitEditMode(checklistItem: SubChecklistFormSubChecklistItemsInner, prop: keyof SubChecklistFormSubChecklistItemsInner): void;
    public onExitEditMode(checklistItem: any, prop: keyof any): void {
        // console.log({ checklistItem, prop }, checklistItem[prop]);

        const value = (checklistItem as any)[prop];
        if (isChecklistItem(checklistItem)) {
            this.checklist().checklistItems = (this.checklist().checklistItems ?? []).map((ci) =>
                ci.id === checklistItem.id
                    ? {
                          ...checklistItem,
                      }
                    : ci,
            );

            this.updateChecklistItem.emit({ prop: String(prop), value, id: checklistItem.id });
        }

        if (isSubChecklistItem(checklistItem)) {
            const subChecklist = (this.checklist().checklistItems ?? []).find((ci) => ci.id === checklistItem.subChecklistId);
            if (!isNil(subChecklist)) {
                // subChecklist should actually never be nil, but just in case and to make the compiler happy :)
                subChecklist.subChecklistItems = (subChecklist.subChecklistItems ?? []).map((i) => (i.id === checklistItem.id ? { ...checklistItem } : i));

                this.updateSubChecklistItem.emit({ prop: String(prop), value, id: checklistItem.id });
            }
        }

        this.checklist.update((c) => ({ ...c }));
    }

    public onExitDualEditMode(
        subChecklistItem: SubChecklistFormSubChecklistItemsInner,
        leftProp: keyof SubChecklistFormSubChecklistItemsInner,
        rightProp: keyof SubChecklistFormSubChecklistItemsInner,
    ): void {
        this.subChecklistItemInEditMode.set(false);
        // console.log({ checklistItem: subChecklistItem, leftProp, rightProp }, subChecklistItem[leftProp], subChecklistItem[rightProp]);

        const subChecklist = (this.checklist().checklistItems ?? []).find((ci) => ci.id === subChecklistItem.subChecklistId);
        if (!isNil(subChecklist)) {
            subChecklist!.subChecklistItems = (subChecklist!.subChecklistItems ?? []).map((i) => (i.id === subChecklistItem.id ? { ...subChecklistItem } : i));

            const leftValue = subChecklistItem[leftProp];
            const rightValue = subChecklistItem[rightProp];
            this.updateSubChecklistItem.emit({
                id: subChecklistItem.id,
                leftProp,
                rightProp,
                leftValue,
                rightValue,
            });

            this.checklist.update((c) => ({ ...c }));
        }
    }

    public addChecklist(event: MenuItemCommandEvent): void {
        const { column, page } = event.item!;
        const checklist: IChecklistVM = this.checklist();

        const newChecklist: any = {
            id: uuidv4(),
            checklistId: checklist.id,
            column,
            page,
            position: (this.checklist().checklistItems ?? []).length,
            type: ChecklistItemType.SubChecklist,
            title: '',
            color: '#d4d4d4', // @TODO: use defaultColor from checklist
            subChecklistItems: [],
        };
        this.checklist().checklistItems = [
            ...(this.checklist().checklistItems ?? []), //
            newChecklist,
        ];

        this.addChecklistItem.emit(newChecklist);

        this.checklist.update((c) => ({ ...c }));
    }

    public addSectionTitle(event: MenuItemCommandEvent): void {
        const { column, page } = event.item!;
        const checklist: IChecklistVM = this.checklist();

        const newSectionTitle: any = {
            id: uuidv4(),
            checklistId: checklist.id,
            column,
            page,
            position: (this.checklist().checklistItems ?? []).length,
            type: ChecklistItemType.SectionTitle,
            text: '',
            color: '#d4d4d4', // @TODO: use defaultColor from checklist
        };
        this.checklist().checklistItems = [
            ...(this.checklist().checklistItems ?? []), //
            newSectionTitle,
        ];

        this.addChecklistItem.emit(newSectionTitle);

        this.checklist.update((c) => ({ ...c }));
    }

    public addTextbox(event: MenuItemCommandEvent): void {
        const { column, page } = event.item!;
        const checklist: IChecklistVM = this.checklist();

        const newTextbox = {
            id: uuidv4(),
            checklistId: checklist.id,
            column,
            page,
            position: (this.checklist().checklistItems ?? []).length,
            type: ChecklistItemType.TextBox,
            text: '',
            color: '#d4d4d4', // @TODO: use defaultColor from checklist
        };
        this.checklist().checklistItems = [
            ...(this.checklist().checklistItems ?? []), //
            newTextbox,
        ];

        this.addChecklistItem.emit(newTextbox);

        this.checklist.update((c) => ({ ...c }));
    }

    public addPostcondition(event: MenuItemCommandEvent): void {
        const { subChecklistId } = event.item!;

        this.addToChecklistItems(subChecklistId, {
            subChecklistId,
            type: SubChecklistItemType.Postcondition,
            id: uuidv4(),
            text: '',
            position: 9999,
        });
    }

    public addText(event: MenuItemCommandEvent, side: 'left' | 'right'): void {
        const { subChecklistId } = event.item!;

        this.addToChecklistItems(subChecklistId, {
            subChecklistId,
            type: side === 'left' ? SubChecklistItemType.LeftText : SubChecklistItemType.RightText,
            id: uuidv4(),
            text: '',
            position: 9999,
        });
    }

    public addPrecondition(event: MenuItemCommandEvent): void {
        const { subChecklistId } = event.item!;

        this.addToChecklistItems(subChecklistId, {
            subChecklistId,
            type: SubChecklistItemType.Precondition,
            id: uuidv4(),
            text: '',
            position: 9999,
        });
    }

    public addSubtitle(event: MenuItemCommandEvent): void {
        const { subChecklistId } = event.item!;

        this.addToChecklistItems(subChecklistId, {
            subChecklistId,
            type: SubChecklistItemType.Subtitle,
            id: uuidv4(),
            text: '',
            position: 9999,
        });
    }

    public addCheckItem(event: MenuItemCommandEvent): void {
        const { subChecklistId } = event.item!;

        this.addToChecklistItems(subChecklistId, {
            subChecklistId,
            type: SubChecklistItemType.CheckItem,
            id: uuidv4(),
            item: '',
            action: '',
            position: 9999,
        });
    }

    public dropSubChecklist(
        $event: CdkDragDrop<Array<SubChecklistFormSubChecklistItemsInner> | undefined, any>,
        checklistItem: ChecklistFormChecklistItemsInner,
    ): void {
        this.#document?.body?.classList.remove('!cursor-grabbing');

        console.log($event, checklistItem);

        moveItemInArray(
            checklistItem.subChecklistItems ?? [], //
            $event.previousIndex,
            $event.currentIndex,
        );

        checklistItem.subChecklistItems = (checklistItem.subChecklistItems ?? []).map((c, i) => ({ ...c, position: i }));
        // checklistItems = checklistItems.map((c) => checklistColumn.checklistItems.find((i) => i.id === c.id) || c);

        // let checklistItems = this.checklist().checklistItems!;
        this.updateSubChecklistItemsPosition.emit(checklistItem.subChecklistItems);
        this.checklist.update((checklist) => ({
            ...checklist,
            checklistItems: checklist.checklistItems?.map((ci) => (ci.id === checklistItem.id ? checklistItem : ci)),
        }));
    }

    public onEnterEditMode(): void {
        this.subChecklistItemInEditMode.set(true);
    }

    private addToChecklistItems(subChecklistId: string, item: SubChecklistFormSubChecklistItemsInner): void {
        const subChecklist = (this.checklist().checklistItems ?? []).find((ci) => ci.id === subChecklistId);

        subChecklist?.subChecklistItems!.push(item);

        this.addSubChecklistItem.emit(item);

        this.checklist.update((c) => ({ ...c }));
    }

    private makeObject(list: (string | number)[], valueSuffix?: string): Record<string, string | number> {
        return list.reduce((o, i) => ({ ...o, [i]: valueSuffix ? `${i}${valueSuffix}` : i }), {});
    }

    private mapToSelectOptions(options: Record<string, string | number>, sortFunc: Function, flipKeyValue = false): { key: string; value: string | number }[] {
        return sortFunc(
            Object.entries(options).map(([key, value]) =>
                flipKeyValue
                    ? {
                          key: value,
                          value: key,
                      }
                    : {
                          key,
                          value,
                      },
            ),
        );
    }
}
