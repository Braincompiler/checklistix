import { isNil } from 'ramda';

import { SubChecklistFormSubChecklistItemsInner } from '@api';

export function isSubChecklistItem(o: any): o is SubChecklistFormSubChecklistItemsInner {
    return !isNil(o) && 'subChecklistId' in o;
}
