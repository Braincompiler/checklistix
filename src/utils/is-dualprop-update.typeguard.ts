import { isNil } from 'ramda';

import { IDualPropUpdate } from '@components';

export function isDualpropUpdate(o: any): o is IDualPropUpdate {
    return !isNil(o) && 'leftProp' in o && 'rightProp' in o;
}
