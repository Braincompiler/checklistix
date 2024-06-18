import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, makeEnvironmentProviders, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { MessageService } from 'primeng/api';

import { Configuration, ConfigurationParameters } from '@api';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { ChecklistMapper, provideMapper, withMapper } from './mapper';

export function withApiConfiguration(configParams: ConfigurationParameters) {
    return new Configuration({
        ...configParams,
    });
}

export function provideApi(configuration: Configuration) {
    return makeEnvironmentProviders([
        {
            provide: Configuration,
            useValue: configuration,
        },
    ]);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withInterceptors([]), //
            withFetch(),
        ),
        provideApi(
            withApiConfiguration({
                basePath: environment.endpoint,
            }),
        ),
        provideZoneChangeDetection({ eventCoalescing: true }), //
        // provideExperimentalZonelessChangeDetection(), // not yet supported by hydration
        provideAnimationsAsync(),
        provideRouter(
            routes,
            withComponentInputBinding(),
            // withDebugTracing(),
        ),
        provideClientHydration(),
        provideMapper(
            withMapper(
                new ChecklistMapper(), //
            ),
        ),

        MessageService,
    ],
};
