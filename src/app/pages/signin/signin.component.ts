import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AppStore } from '../../app.store';

@Component({
    selector: 'cx-sigin',
    templateUrl: 'signin.component.html',
    standalone: true,
    imports: [
        RouterLink, //
        FormsModule,
    ],
})
export class SigninComponent {
    readonly #appStore = inject(AppStore);
    readonly #router = inject(Router);

    public async onLogin() {
        this.#appStore.login();

        await this.#router.navigateByUrl('/my/checklists');
    }
}
