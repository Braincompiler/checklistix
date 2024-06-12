import { inject } from '@angular/core';
import { RedirectCommand, Router, Routes } from '@angular/router';

import { MessageService } from 'primeng/api';

import { AppStore } from '../app.store';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'help',
        loadComponent: () => import('./help/help.component').then((m) => m.HelpComponent),
    },
    {
        path: 'signup',
        loadComponent: () => import('./signup/signup.component').then((m) => m.SignupComponent),
    },
    {
        path: 'signin',
        loadComponent: () => import('./signin/signin.component').then((m) => m.SigninComponent),
    },
    {
        path: 'pricing',
        loadComponent: () => import('./pricing/pricing.component').then((m) => m.PricingComponent),
    },
    {
        path: 'my',
        canActivate: [
            () => {
                const isLoggedIn = inject(AppStore).isLoggedIn();
                if (!isLoggedIn) {
                    const messageService = inject(MessageService);

                    messageService.add({
                        severity: 'error',
                        summary: 'Unauthorized',
                        detail: 'Please login first to access this page',
                        life: 60000,
                    });

                    return new RedirectCommand(inject(Router).parseUrl('/'));
                }

                return isLoggedIn;
            },
        ],
        loadChildren: () => import('./my/routes').then((m) => m.routes),
    },
];
