import { Component, DestroyRef, ElementRef, forwardRef, input, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { isRecord, strIsEmpty } from '@utils';
import { isNil } from 'ramda';

import { BaseEditComponent } from '../base-edit/base-edit.component';

@Component({
    selector: 'cx-dual-input-edit',
    templateUrl: 'dual-input-edit.component.html',
    styleUrl: 'dual-input-edit.component.scss',
    standalone: true,
    imports: [
        ReactiveFormsModule, //
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DualInputEditComponent),
            multi: true,
        },
    ],
    host: {
        '[class.edit-enabled]': '!disableEditMode()',
    },
})
export class DualInputEditComponent extends BaseEditComponent<Record<string, string>> {
    readonly #resetLeftFormValue = signal<string | null>(null);
    readonly #resetRightFormValue = signal<string | null>(null);

    public readonly leftPropName = input.required<string>();
    public readonly rightPropName = input.required<string>();
    public readonly leftPlaceholder = input('');
    public readonly rightPlaceholder = input('');

    #baseFormValue?: any;
    #focusSide: 'left' | 'right' = 'left';

    #leftInput?: ElementRef;
    @ViewChild('leftInput', { static: false })
    public set leftInput(value: ElementRef) {
        this.#leftInput = value;
        if (this.#focusSide === 'left') {
            this.#leftInput?.nativeElement?.focus();
        }
    }

    #rightInput?: ElementRef;
    @ViewChild('rightInput', { static: false })
    public set rightInput(value: ElementRef) {
        this.#rightInput = value;
        if (this.#focusSide === 'right') {
            this.#rightInput?.nativeElement?.focus();
        }
    }

    get #leftRawFormValue(): string {
        return this.form?.get(this.leftPropName())?.value ?? '';
    }

    get #rightRawFormValue(): string {
        return this.form?.get(this.rightPropName())?.value ?? '';
    }

    public get leftFormValueIsEmpty(): boolean {
        return strIsEmpty(this.#leftRawFormValue);
    }

    public get leftFormValue(): string {
        // form value is not a signal, so computed() will not work :(
        const value = this.#leftRawFormValue;

        return this.leftFormValueIsEmpty ? 'Double click to edit' : value;
    }

    public get rightFormValueIsEmpty(): boolean {
        return strIsEmpty(this.#rightRawFormValue);
    }

    public get rightFormValue(): string {
        // form value is not a signal, so computed() will not work :(
        const value = this.#rightRawFormValue;

        return this.rightFormValueIsEmpty ? 'Double click to edit' : value;
    }

    public constructor(private readonly dRef: DestroyRef) {
        super(dRef);
    }

    public override ngOnInit(): void {
        this.form = this.fb.group({
            [this.leftPropName()]: this.fb.nonNullable.control(''),
            [this.rightPropName()]: this.fb.nonNullable.control(''),
        });

        this.form?.valueChanges
            .pipe(
                takeUntilDestroyed(this.dRef), //
                // filter(({ left, right }) => !isNil(left) && !isNil(right)), // 🤔
            )
            .subscribe((formValue) => {
                const left = formValue[this.leftPropName()];
                const right = formValue[this.rightPropName()];

                this.onChange?.({
                    ...this.#baseFormValue,
                    [this.leftPropName()]: left,
                    [this.rightPropName()]: right,
                });
                this.onTouched?.();
            });
    }

    public override writeValue(obj: unknown): void {
        if (!isNil(obj) && isRecord(obj)) {
            // console.log(obj, (obj as any)[this.leftPropName()], (obj as any)[this.rightPropName()]);
            this.#baseFormValue = obj;
            this.form?.patchValue({
                [this.leftPropName()]: obj[this.leftPropName()],
                [this.rightPropName()]: obj[this.rightPropName()],
            });
        }
    }

    public enterDualEditMode(side: 'left' | 'right'): void {
        this.onEnterEditMode();
        this.#focusSide = side;

        this.#resetLeftFormValue.set(this.#leftRawFormValue);
        this.#resetRightFormValue.set(this.#rightRawFormValue);
    }

    public override onExitEditMode(hasChanges: boolean): void {
        super.onExitEditMode(hasChanges);

        if (!hasChanges) {
            this.form?.patchValue({
                [this.leftPropName()]: this.#resetLeftFormValue(),
                [this.rightPropName()]: this.#resetRightFormValue(),
            });

            this.#resetLeftFormValue.set(null);
            this.#resetRightFormValue.set(null);
        }
    }
}
