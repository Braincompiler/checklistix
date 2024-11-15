import { booleanAttribute, Component, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormGroup } from '@angular/forms';

import { strIsEmpty } from '@utils';
import { isNil } from 'ramda';

@Component({
    standalone: true,
    template: ``,
})
export class BaseEditComponent<TFormValue = string> implements ControlValueAccessor, OnInit {
    protected readonly fb = inject(FormBuilder);

    protected onChange?: (value: TFormValue) => void;
    protected onTouched?: () => void;
    protected prop = '';
    protected initialValue = '';

    readonly #resetFormValue = signal<any>(null);

    public readonly disableEditMode = input(true, { transform: (v) => booleanAttribute(v) });
    public readonly dblClickPlaceholder = input('Double click to edit');

    public readonly exitEditMode = output<boolean>();
    public readonly enterEditMode = output<void>();

    public readonly isEditModeActive = signal<boolean>(false);

    public form?: FormGroup;

    get #rawFormValue(): string {
        return (this.form?.get(this.prop)?.value ?? '').trim();
    }

    public get isFormValueEmptyAndNotInEditMode(): boolean {
        return this.formValueIsEmpty && !this.disableEditMode();
    }

    public get formValue(): string {
        // form value is not a signal, so computed() will not work :(
        const value = this.#rawFormValue;

        // @TODO: check the too often re-rendering

        return this.isFormValueEmptyAndNotInEditMode ? this.dblClickPlaceholder() : value;
    }

    public get formValueIsEmpty(): boolean {
        const value = this.#rawFormValue;

        return strIsEmpty(value);
    }

    public constructor(private readonly destroyRef: DestroyRef) {}

    public ngOnInit(): void {
        this.form = this.fb.group({
            [this.prop]: this.fb.nonNullable.control(this.initialValue),
        });

        this.form
            .get(this.prop)
            ?.valueChanges //
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                this.onChange?.(value);
                this.onTouched?.();
            });
    }

    public writeValue(obj: unknown): void {
        if (!isNil(obj)) {
            this.form?.get(this.prop)?.setValue(String(obj));
        }
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        // @TODO: do we need this? 🤔
    }

    public onExitEditMode(hasChanges: boolean): void {
        this.isEditModeActive.set(false);
        this.exitEditMode.emit(hasChanges);

        if (!hasChanges) {
            this.form?.get(this.prop)?.reset(this.#resetFormValue());
            this.#resetFormValue.set(null);
        }
    }

    public onEnterEditMode(): void {
        if (!this.disableEditMode()) {
            this.enterEditMode.emit();
            this.isEditModeActive.set(true);

            this.#resetFormValue.set(this.#rawFormValue);
        }
    }
}
