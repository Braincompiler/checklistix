import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, makeEnvironmentProviders, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { authInterceptor, dataInterceptor } from '@interceptors';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { Configuration as DataAuthConfiguration, ConfigurationParameters as DataAuthConfigurationParameters } from '@api/auth';
import { Configuration as DataApiConfiguration, ConfigurationParameters as DataApiConfigurationParameters } from '@api/data';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
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

        providePrimeNG({
            ripple: true,
            theme: {
                preset: definePreset(Aura, {
                    semantic: {
                        primary: Aura.primitive?.['amber'],
                        secondary: Aura.primitive?.['sky'],
                        colorScheme: {
                            light: {
                                primary: {
                                    color: '{primary.500}',
                                    contrastColor: '#ffffff',
                                    hoverColor: '{primary.600}',
                                    activeColor: '{primary.700}',
                                },
                                highlight: {
                                    background: '{primary.50}',
                                    focusBackground: '{primary.100}',
                                    color: '{primary.700}',
                                    focusColor: '{primary.800}',
                                },
                            },
                            dark: {
                                primary: {
                                    color: '{primary.400}',
                                    contrastColor: '{surface.900}',
                                    hoverColor: '{primary.300}',
                                    activeColor: '{primary.200}',
                                },
                                highlight: {
                                    background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                                    focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                                    color: 'rgba(255,255,255,.87)',
                                    focusColor: 'rgba(255,255,255,.87)',
                                },
                                // overlay: {
                                //     tooltip: {
                                //         background: 'white',
                                //     },
                                // },
                            },
                        },
                    },
                }),
                options: {
                    darkModeSelector: '.dark',
                    cssLayer: {
                        name: 'primeng',
                        order: 'tailwind-base, primeng, tailwind-utilities',
                    },
                },
            },
        }),

        MessageService,
    ],
};
