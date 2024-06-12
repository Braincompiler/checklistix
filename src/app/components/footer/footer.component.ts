import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { BrandLogoComponent } from '../brand-logo/brand-logo.component';

@Component({
    selector: 'cx-footer',
    templateUrl: 'footer.component.html',
    standalone: true,
    imports: [RouterLink, RouterLinkActive, BrandLogoComponent],
})
export class FooterComponent {}
