import { map, pick } from 'ramda';

// export const pickAll = <T extends Record<TKeys, any>, TKeys extends keyof T>(keys: readonly TKeys[], arr: T[]) => map(pick(keys), arr);
export const pickAll = <T extends Record<TKeys, any>, TKeys extends keyof T>(keys: readonly TKeys[], arr: T[]) => arr.map((i) => pick(keys, i));
