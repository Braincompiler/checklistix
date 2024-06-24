import { isNil } from 'ramda';

export function strIsEmpty(s?: string | null) {
    return isNil(s) || s.trim().length === 0;
}
