import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { pipe, switchMap, tap } from 'rxjs';

import { withDevtools, withStorageSync } from '@angular-architects/ngrx-toolkit';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { isNil, omit, pick } from 'ramda';

import { AuthForm, AuthService } from '@api/auth';
import { ChecklistsService } from '@api/data';

import { checklistMapToVM, IChecklistVM } from './mapper';

export interface IAppState {
    user: any | null;
    isLoading: boolean;
    currentChecklist: IChecklistVM | null;
    currentChecklistError: any | null;
}

const initialState: IAppState = {
    user: null,
    isLoading: false,
    currentChecklist: null,
    currentChecklistError: null,
};

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withStorageSync({
        key: 'ChecklistiX.AppState',
        select: (s) => pick(['user'], s),
        storage: () => sessionStorage,
    }),
    withDevtools('checklistix'),

    withComputed(({ user }) => ({
        isLoggedIn: computed(() => !isNil(user())),
    })),

    withMethods(
        (
            store, //
            checklistService = inject(ChecklistsService),
            authService = inject(AuthService),
            router = inject(Router),
        ) => {
            const setIsLoading = (isLoading: boolean) => patchState(store, { isLoading });
            const startIsLoading = () => setIsLoading(true);
            const stopIsLoading = () => setIsLoading(false);

            return {
                setIsLoading,
                startIsLoading,
                stopIsLoading,

                login: rxMethod<AuthForm>(
                    pipe(
                        tap(() => patchState(store, { isLoading: true })),
                        switchMap((authData: AuthForm) =>
                            authService.signIn(authData).pipe(
                                tapResponse({
                                    next: async (user) => {
                                        patchState(store, { user: omit(['expires_at', 'expires_in', 'refresh_token'], user) });

                                        await router.navigateByUrl('/my/checklists');
                                    },
                                    error: (err) => {
                                        console.error(err);
                                        patchState(store, { user: null });
                                    },
                                    finalize: () => patchState(store, { isLoading: false }),
                                }),
                            ),
                        ),
                    ),
                ),

                logout: rxMethod<void>(
                    pipe(
                        tap(() => patchState(store, { isLoading: true })),
                        switchMap(() =>
                            authService.signOut().pipe(
                                tapResponse({
                                    next: async () => patchState(store, { user: null }),
                                    error: (err) => {
                                        console.error(err);
                                        patchState(store, { user: null });
                                    },
                                    finalize: () => patchState(store, { isLoading: false }),
                                }),
                            ),
                        ),
                    ),
                ),

                logoutWithoutSignOutRequest: rxMethod<void>(pipe(tap(() => patchState(store, { user: null })))),

                loadById: rxMethod<string>(
                    pipe(
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

                updateAccessToken: (accessToken: string) => {
                    patchState(store, { user: { ...store.user(), access_token: accessToken } });
                },
            };
        },
    ),
);
