import { booleanAttribute, Component, DestroyRef, ElementRef, forwardRef, inject, input, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { BaseEditComponent } from '../base-edit/base-edit.component';

@Component({
    selector: 'cx-single-line-edit',
    templateUrl: 'single-line-edit.component.html',
    styleUrl: 'single-line-edit.component.scss',
    standalone: true,
    imports: [
        ReactiveFormsModule, //
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SingleLineEditComponent),
            multi: true,
        },
    ],
    host: {
        '[class.edit-enabled]': '!disableEditMode()',
    },
})
export class SingleLineEditComponent extends BaseEditComponent {
    public readonly fullWidth = input(false, { transform: (v) => booleanAttribute(v) });
    public readonly textRight = input(false, { transform: (v) => booleanAttribute(v) });
    public readonly noBlock = input(false, { transform: (v) => booleanAttribute(v) });
    public readonly placeholder = input('');

    protected override prop = 'singleLine';
    protected override initialValue = '';

    @ViewChild('singleLineInput', { static: false })
    private set singleLineInput(value: ElementRef) {
        value?.nativeElement?.focus();
    }

    public constructor() {
        super(inject(DestroyRef));
    }
}
