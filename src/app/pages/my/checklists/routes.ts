import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./checklists.component').then((m) => m.ChecklistsComponent),
        children: [
            {
                path: '',
                // pathMatch: 'full',
                loadComponent: () => import('./overview/overview.component').then((m) => m.OverviewComponent),
            },
            {
                path: ':id/editor',
                loadComponent: () => import('./edit/editor.component').then((m) => m.EditorComponent),
            },
        ],
    },
];
