import { computed, inject } from '@angular/core';

import { pipe, switchMap, tap } from 'rxjs';

import { withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { isNil } from 'ramda';

import { ChecklistsService } from '@api';

import { checklistMapToVM, IChecklistVM } from './mapper';

export interface IUserState {
    userId: string | null;
}

export interface IAppState {
    user: IUserState;
    isLoading: boolean;
    currentChecklist: IChecklistVM | null;
    currentChecklistError: any | null;
}

const initialState: IAppState = {
    user: { userId: null },
    isLoading: false,
    currentChecklist: null,
    currentChecklistError: null,
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

    withMethods(
        (
            store, //
            checklistService = inject(ChecklistsService),
        ) => {
            const setIsLoading = (isLoading: boolean) => patchState(store, { isLoading });
            const startIsLoading = () => setIsLoading(true);
            const stopIsLoading = () => setIsLoading(false);

            return {
                setIsLoading,
                startIsLoading,
                stopIsLoading,

                login() {
                    patchState(store, { user: { userId: 'null' } });
                },

                logout() {
                    patchState(store, { user: { userId: null } });
                },

                loadById: rxMethod<string>(
                    pipe(
                        // distinctUntilChanged(), //
                        tap(() => patchState(store, { isLoading: true })),
                        switchMap((id) =>
                            checklistService.checklistsIdGet(id).pipe(
                                tapResponse({
                                    next: (checklist) => patchState(store, { currentChecklist: checklistMapToVM(checklist), currentChecklistError: null }),
                                    error: (err) => {
                                        console.error(err);
                                        patchState(store, { currentChecklist: null, currentChecklistError: err });
                                    },
                                    finalize: () => patchState(store, { isLoading: false }),
                                }),
                            ),
                        ),
                    ),
                ),
            };
        },
    ),
);
