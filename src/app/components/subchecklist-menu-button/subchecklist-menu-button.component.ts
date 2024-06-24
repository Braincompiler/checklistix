import { booleanAttribute, Component, input } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

@Component({
    selector: 'cx-subchecklist-menu-button',
    templateUrl: 'subchecklist-menu-button.component.html',
    standalone: true,
    imports: [MenuModule, Button],
})
export class SubchecklistMenuButtonComponent {
    public readonly wide = input(false, { transform: (v) => booleanAttribute(v) });
    public readonly menuItems = input.required<MenuItem[]>();
}
