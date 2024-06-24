import { isNil } from 'ramda';

import { ChecklistFormChecklistItemsInner } from '@api';

export function isChecklistItem(o: any): o is ChecklistFormChecklistItemsInner {
    return !isNil(o) && 'checklistId' in o;
}
