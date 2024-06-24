import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { afterNextRender, Component, DestroyRef, forwardRef, inject, Injector, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

import { Nl2brPipe } from '@pipes';

import { BaseEditComponent } from '../base-edit/base-edit.component';

@Component({
    selector: 'cx-multi-line-edit',
    templateUrl: 'multi-line-edit.component.html',
    styleUrl: 'multi-line-edit.component.scss',
    standalone: true,
    imports: [
        ReactiveFormsModule, //
        CdkTextareaAutosize,
        Nl2brPipe,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiLineEditComponent),
            multi: true,
        },
    ],
    host: {
        '[class.edit-enabled]': '!disableEditMode()',
    },
})
export class MultiLineEditComponent extends BaseEditComponent {
    @ViewChild('multiInput') public multiInput?: CdkTextareaAutosize;

    readonly #injector = inject(Injector);

    protected override prop = 'multiLine';
    protected override initialValue = '';

    public constructor() {
        super(inject(DestroyRef));
    }

    public override onEnterEditMode(): void {
        super.onEnterEditMode();

        afterNextRender(() => this.multiInput?.resizeToFitContent(true), {
            injector: this.#injector,
        });
    }
}
