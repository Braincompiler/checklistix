import { Pipe, PipeTransform } from '@angular/core';

import { MenuItem } from 'primeng/api';

@Pipe({
    name: 'cxAdd2MenuitemPipe',
    standalone: true,
})
export class Add2menuitemPipe implements PipeTransform {
    public transform(menuItems: MenuItem[], customProps: Record<string, any>): MenuItem[] {
        return menuItems.map((mi) => ({ ...mi, ...customProps }));
    }
}
