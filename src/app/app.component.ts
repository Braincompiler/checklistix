import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { filter } from 'rxjs';

import { PrimeNGConfig } from 'primeng/api';
import { definePreset } from 'primeng/themes';
import { Aura } from 'primeng/themes/aura';
import { ToastModule } from 'primeng/toast';

import { IStaticMethods } from 'preline/preline';

import { FooterComponent, TopbarComponent } from '@components';

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
        HSTooltip: any;
    }
}

@Component({
    selector: 'cx-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet, //
        TopbarComponent,
        FooterComponent,
        ToastModule,
    ],
})
export class AppComponent implements OnInit {
    readonly #primeNGConfig = inject(PrimeNGConfig);
    readonly #router = inject(Router);
    readonly #destroyRef = inject(DestroyRef);
    readonly #doc = inject(DOCUMENT); // https://github.com/angular/universal/blob/main/docs/gotchas.md#strategy-1-injection

    public constructor() {
        // this.#primeNGConfig.ripple = true;
        this.#primeNGConfig.theme.set({
            preset: definePreset(Aura, {
                semantic: {
                    primary: Aura.primitive['amber'],
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
        });
    }

    public ngOnInit(): void {
        // https://preline.co/docs/frameworks-angular.html
        this.#router.events //
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter((e) => e instanceof NavigationEnd),
            )
            .subscribe(() => this.runPrelineAutoInit());

        // this.runPrelineAutoInit();
    }

    private runPrelineAutoInit() {
        setTimeout(() => {
            // console.log('autoInit', this.#doc.defaultView?.HSTooltip?.autoInit);
            this.#doc.defaultView?.HSStaticMethods?.autoInit();
            this.#doc.defaultView?.HSTooltip?.autoInit();
            this.#doc.defaultView?.HSAccordion?.autoInit();
        }, 300);
    }
}
