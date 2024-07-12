import { AfterViewInit, booleanAttribute, Component, ElementRef, forwardRef, input, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'cx-editor-input',
    templateUrl: 'editor-input.component.html',
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EditorInputComponent),
            multi: true,
        },
    ],
    imports: [FormsModule],
})
export class EditorInputComponent implements ControlValueAccessor, AfterViewInit {
    #onChange = (_value: string) => {};
    #onTouched = () => {};

    public readonly label = input.required<string>();
    public readonly autofocus = input(false, { transform: (v) => booleanAttribute(v) });

    public readonly type = input<string>('text');
    public readonly placeholder = input<string>('');
    public readonly inputId = input<string>(`input-${Math.random() * 100}`);

    @ViewChild('inputElement')
    private readonly inputElement?: ElementRef<HTMLInputElement>;

    public _value?: string;

    public ngAfterViewInit(): void {
        if (this.autofocus()) {
            this.inputElement?.nativeElement?.focus();
        }
    }

    public writeValue(value: string): void {
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
