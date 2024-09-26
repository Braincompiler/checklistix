import { isNil } from 'ramda';

import { ChecklistFormChecklistItemsInner } from '@api/data';

export function isChecklistItem(o: any): o is ChecklistFormChecklistItemsInner {
    return !isNil(o) && 'checklistId' in o;
}
