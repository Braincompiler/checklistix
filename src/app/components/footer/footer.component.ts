import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
    selector: 'cx-footer',
    templateUrl: 'footer.component.html',
    standalone: true,
    imports: [
        RouterLink, //
        BrandLogoComponent,
    ],
})
export class FooterComponent {}
