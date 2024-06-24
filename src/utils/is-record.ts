import { isNil } from 'ramda';

export function isRecord(o: unknown): o is Record<string, unknown> {
    return typeof o === 'object' && !isNil(o);
}
