import { isNil } from 'ramda';

import { SubChecklistFormSubChecklistItemsInner, SubChecklistItemType } from '@api/data';

import { isSubChecklistItem } from './is-sub-checklist-item.typeguard';

export function isSubChecklistItemLeftHandText(o: any): o is SubChecklistFormSubChecklistItemsInner {
    return isSubChecklistItem(o) && o.type === SubChecklistItemType.LeftText;
}
