import { computed } from '@angular/core';

import { withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { isNil } from 'ramda';

export interface IUserState {
    userId: string | null;
}

export interface IAppState {
    user: IUserState;
}

const initialState: IAppState = {
    user: { userId: null },
};

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialState), //
    withStorageSync({
        key: 'appState',
    }),
    withDevtools('checklistix'),

    withComputed(({ user }) => ({
        isLoggedIn: computed(() => !isNil(user.userId())),
    })),

    withMethods((store) => ({
        login() {
            patchState(store, { user: { userId: 'null' } });
        },

        logout() {
            patchState(store, { user: { userId: null } });
        },
    })),
);
