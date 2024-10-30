import { booleanAttribute, Component, input } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'cx-subchecklist-menu-button',
    templateUrl: 'subchecklist-menu-button.component.html',
    standalone: true,
    imports: [MenuModule, ButtonModule],
    styles: `
        :host ::ng-deep .p-button {
            border: 0 none;
            padding: 0.15rem 0;
        }
    `,
})
export class SubchecklistMenuButtonComponent {
    public readonly wide = input(false, { transform: (v) => booleanAttribute(v) });
    public readonly menuItems = input.required<MenuItem[]>();
}
