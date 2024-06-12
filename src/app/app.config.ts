import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { MessageService } from 'primeng/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(withInterceptors([])),
        provideZoneChangeDetection({ eventCoalescing: true }), //
        // provideExperimentalZonelessChangeDetection(), // not yet supported by hydration
        provideAnimationsAsync(),
        provideRouter(
            routes,
            withComponentInputBinding(),
            // withDebugTracing(),
        ),
        provideClientHydration(),

        MessageService,
    ],
};
