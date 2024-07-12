import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AppStore } from '../../app.store';

@Component({
    selector: 'cx-sigin',
    templateUrl: 'signin.component.html',
    standalone: true,
    imports: [
        RouterLink, //
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class SigninComponent {
    readonly #appStore = inject(AppStore);
    // readonly #router = inject(Router);
    readonly #fb = inject(FormBuilder);
    // readonly #destroyRef = inject(DestroyRef);

    public readonly form = this.#fb.group({
        email: this.#fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.email]),
        password: this.#fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
        rememberMe: this.#fb.nonNullable.control(false),
    });

    public get emailCtrl(): AbstractControl {
        return this.form.get('email')!;
    }

    public get passwordCtrl(): AbstractControl {
        return this.form.get('password')!;
    }

    public async onLogin() {
        const { email, password } = this.form.value;

        this.#appStore.login({
            email: email!,
            password: password!,
        });

        // await this.#router.navigateByUrl('/my/checklists');
    }
}
