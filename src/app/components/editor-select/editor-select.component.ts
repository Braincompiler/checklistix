import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'cx-editor-select',
    templateUrl: 'editor-select.component.html',
    styleUrl: 'editor-select.component.scss',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorSelectComponent),
            multi: true,
        },
    ],
    imports: [FormsModule],
})
export class EditorSelectComponent implements ControlValueAccessor {
    #onChange = (_value: string) => {};
    #onTouched = () => {};

    public readonly label = input.required<string>();
    public readonly options = input.required<{ key: string; value: string | number }[]>();

    public _value?: any;

    public writeValue(value: any): void {
        this._value = value;
    }

    public registerOnChange(fn: any): void {
        this.#onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.#onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        // @TODO: Implement?
    }

    public onValueChange(value: string): void {
        this._value = value;
        this.#onChange(this._value);
        this.#onTouched();
    }
}
