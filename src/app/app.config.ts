import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, makeEnvironmentProviders, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { MessageService } from 'primeng/api';

import { authInterceptor } from '@interceptors';

import { Configuration as DataAuthConfiguration, ConfigurationParameters as DataAuthConfigurationParameters } from '@api/auth';
import { Configuration as DataApiConfiguration, ConfigurationParameters as DataApiConfigurationParameters } from '@api/data';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { dataInterceptor } from './interceptors/data.interceptor';
import { ChecklistMapper, provideMapper, withMapper } from './mapper';

export function withDataApiConfiguration(configParams: DataApiConfigurationParameters) {
    return new DataApiConfiguration({
        ...configParams,
    });
}

export function provideDataApi(configuration: DataApiConfiguration) {
    return makeEnvironmentProviders([
        {
            provide: DataApiConfiguration,
            useValue: configuration,
        },
    ]);
}

export function withAuthApiConfiguration(configParams: DataAuthConfigurationParameters) {
    return new DataAuthConfiguration({
        ...configParams,
    });
}

export function provideAuthApi(configuration: DataAuthConfiguration) {
    return makeEnvironmentProviders([
        {
            provide: DataAuthConfiguration,
            useValue: configuration,
        },
    ]);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideHttpClient(
            withInterceptors([
                authInterceptor, //
                dataInterceptor,
            ]),
            withFetch(),
        ),
        provideDataApi(
            withDataApiConfiguration({
                basePath: environment.dataEndpoint,
                // withCredentials: true,
            }),
        ),
        provideAuthApi(
            withAuthApiConfiguration({
                basePath: environment.authEndpoint,
                // withCredentials: true,
            }),
        ),
        provideZoneChangeDetection({ eventCoalescing: true }), //
        // provideExperimentalZonelessChangeDetection(), // not yet supported by hydration
        provideAnimationsAsync(),
        provideRouter(
            routes,
            withRouterConfig({
                onSameUrlNavigation: 'reload',
                urlUpdateStrategy: 'eager',
            }),
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
