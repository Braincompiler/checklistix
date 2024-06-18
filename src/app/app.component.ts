import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { filter } from 'rxjs';

import { PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { IStaticMethods } from 'preline/preline';

import { FooterComponent, TopbarComponent } from '@components';

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
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
        this.#primeNGConfig.ripple = true;
    }

    public ngOnInit(): void {
        // https://preline.co/docs/frameworks-angular.html
        this.#router.events //
            .pipe(
                takeUntilDestroyed(this.#destroyRef),
                filter((e) => e instanceof NavigationEnd),
            )
            .subscribe(() => {
                setTimeout(() => {
                    this.#doc.defaultView?.HSStaticMethods?.autoInit();
                }, 100);
            });
    }
}
