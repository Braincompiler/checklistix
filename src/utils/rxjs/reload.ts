import { BehaviorSubject, map, merge, Observable, scan } from 'rxjs';

import { identity } from 'ramda';

function reload(selector: Function = identity) {
    return scan((oldValue, currentValue) => {
        if (!oldValue && !currentValue) {
            throw new Error(`Reload can't run before initial load`);
        }

        return selector(currentValue || oldValue);
    });
}

export function combineReload<T>(
    value$: Observable<T>, //
    reload$: Observable<void>,
    selector: Function = identity,
): Observable<T> {
    return merge(value$, reload$).pipe(
        reload(selector),
        map((value: any) => value as T),
    );
}

export function createReload<T>(
    reload$: Observable<void>, //
    selector: Function = identity,
): Observable<T> {
    return merge(new BehaviorSubject<boolean>(true), reload$).pipe(
        reload(selector),
        map((value: any) => value as T),
    );
}
