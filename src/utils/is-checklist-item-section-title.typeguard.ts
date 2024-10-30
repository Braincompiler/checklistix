import { isNil } from 'ramda';

import { ChecklistFormChecklistItemsInner, ChecklistItemType } from '@api/data';

export function isChecklistItemSectionTitle(o: ChecklistFormChecklistItemsInner): o is ChecklistFormChecklistItemsInner {
    return !isNil(o) && o.type === ChecklistItemType.SectionTitle;
}
