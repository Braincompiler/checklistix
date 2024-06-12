import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { AppStore } from '../../app.store';

export const routes: Routes = [
    {
        path: 'checklists',
        // loadComponent: () => import('./checklists/checklists.component').then((m) => m.ChecklistsComponent),
        loadChildren: () => import('./checklists/routes').then((m) => m.routes),
    },
    {
        path: 'subscriptions',
        loadComponent: () => import('./subscriptions/subscriptions.component').then((m) => m.SubscriptionsComponent),
    },
    {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then((m) => m.SettingsComponent),
    },
    {
        path: 'logout',
        redirectTo: () => {
            const router = inject(Router);
            const appStore = inject(AppStore);

            appStore.logout();

            return router.createUrlTree(['/']);
        },
    },
];
