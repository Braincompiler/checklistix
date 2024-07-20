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

    public readonly disableEditMode = input(true, { transform: (v) => booleanAttribute(v) });
    public readonly exitEditMode = output<void>();
    public readonly enterEditMode = output<void>();

    public readonly isEditModeActive = signal<boolean>(false);

    public form?: FormGroup;

    get #rawFormValue(): string {
        return (this.form?.get(this.prop)?.value ?? '').trim();
    }

    public get formValue(): string {
        // form value is not a signal, so computed() will not work :(
        const value = this.#rawFormValue;

        // @TODO: check the too often re-rendering

        return this.formValueIsEmpty && !this.disableEditMode() ? 'Double click to edit' : value;
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

    public onExitEditMode(): void {
        this.isEditModeActive.set(false);
        this.exitEditMode.emit();
    }

    public onEnterEditMode(): void {
        if (!this.disableEditMode()) {
            this.enterEditMode.emit();
            this.isEditModeActive.set(true);
        }
    }
}
