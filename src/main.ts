import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

if (globalThis.window && !localStorage.getItem('hs_theme')) {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

    localStorage.setItem('hs_theme', darkThemeMq.matches ? 'dark' : 'light');
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
