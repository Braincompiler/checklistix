import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, filter, tap, throwError } from 'rxjs';

import { MessageService } from 'primeng/api';

import { isNil } from 'ramda';

import { AppStore } from '../app.store';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);
    const appStore = inject(AppStore);
    const messageService = inject(MessageService);

    if (!isNil(appStore.user()?.access_token)) {
        req = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${appStore.user()!.access_token}`),
        });
    }

    return next(req).pipe(
        filter((event): event is HttpResponse<unknown> => event instanceof HttpResponse),
        tap((event) => {
            // console.log((event as any).headers);
            if (event.headers.has('X-New-Token')) {
                appStore.updateAccessToken(event.headers.get('X-New-Token')!);
            }
        }),
        catchError((err: HttpErrorResponse) => {
            // console.error(err);

            if (err.status === 401) {
                messageService.add({
                    severity: 'error',
                    summary: 'Logged out',
                    detail: 'Your session is expired. Please login again.',
                    life: 5000,
                });
                appStore.logoutWithoutSignOutRequest();
                router.navigateByUrl('/signin');
            }

            return throwError(() => err);
        }),
    );
};
