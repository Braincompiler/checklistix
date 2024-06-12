import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'cx-checklists',
    templateUrl: 'checklists.component.html',
    standalone: true,
    imports: [RouterOutlet],
})
export class ChecklistsComponent {}
