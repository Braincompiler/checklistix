import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, throwError } from 'rxjs';

import { MessageService } from 'primeng/api';

import { AppStore } from '../app.store';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const router = inject(Router);
    const appStore = inject(AppStore);
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            console.log(err);
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
