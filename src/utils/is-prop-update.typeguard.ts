import { isNil } from 'ramda';

import { IPropUpdate } from '@components';

export function isPropUpdate(o: any): o is IPropUpdate {
    return !isNil(o) && 'prop' in o && 'value' in o;
}
