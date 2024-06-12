import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AppStore } from '../../app.store';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
    selector: 'cx-topbar',
    templateUrl: 'topbar.component.html',
    standalone: true,
    imports: [
        RouterLink, //
        RouterLinkActive,
        BrandLogoComponent,
    ],
})
export class TopbarComponent {
    public readonly appStore = inject(AppStore);
}
