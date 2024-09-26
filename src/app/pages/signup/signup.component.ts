import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '@api/auth';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const { password, confirmPassword } = control.value;

    return password === confirmPassword ? null : { passwordNoMatch: true };
};

@Component({
    selector: 'cx-signup',
    templateUrl: 'signup.component.html',
    standalone: true,
    imports: [RouterLink, JsonPipe, ReactiveFormsModule],
})
export class SignupComponent {
    readonly #authService = inject(AuthService);
    readonly #fb = inject(FormBuilder);
    readonly #destroyRef = inject(DestroyRef);

    public readonly form = this.#fb.group(
        {
            email: this.#fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.email]),
            password: this.#fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
            confirmPassword: this.#fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
            acceptTermsAndCondition: this.#fb.nonNullable.control(false, [Validators.requiredTrue]),
        },
        {
            validators: [confirmPasswordValidator],
        },
    );

    public get emailCtrl(): AbstractControl {
        return this.form.get('email')!;
    }

    public get passwordCtrl(): AbstractControl {
        return this.form.get('password')!;
    }

    public get confirmPasswordCtrl(): AbstractControl {
        return this.form.get('confirmPassword')!;
    }

    public onSignUp(): void {
        const { email, password } = this.form.value;

        this.#authService
            .signUp({
                email: email!,
                password: password!,
            })
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe();
    }
}
