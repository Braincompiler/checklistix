import { isNil } from 'ramda';

import { ChecklistFormChecklistItemsInner, ChecklistItemType } from '@api/data';

export function isChecklistItemTextbox(o: ChecklistFormChecklistItemsInner): o is ChecklistFormChecklistItemsInner {
    return !isNil(o) && o.type === ChecklistItemType.TextBox;
}
