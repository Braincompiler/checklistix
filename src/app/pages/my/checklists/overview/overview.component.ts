import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'cx-checklists-overview',
    templateUrl: 'overview.component.html',
    standalone: true,
    imports: [RouterLink],
})
export class OverviewComponent {}
