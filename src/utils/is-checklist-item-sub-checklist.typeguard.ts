import { isNil } from 'ramda';

import { ChecklistFormChecklistItemsInner, ChecklistItemType } from '@api/data';
import { isChecklistItem } from './is-checklist-item.typeguard';

export function isChecklistItemSubChecklist(o: ChecklistFormChecklistItemsInner): o is ChecklistFormChecklistItemsInner {
    return isChecklistItem(o) && o.type === ChecklistItemType.SubChecklist;
}
