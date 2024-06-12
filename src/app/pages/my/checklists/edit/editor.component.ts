import { Component, input } from '@angular/core';

@Component({
    selector: 'cx-checklists-editor',
    templateUrl: 'editor.component.html',
    standalone: true,
})
export class EditorComponent {
    public readonly checklistId = input.required({ alias: 'id' });
}
