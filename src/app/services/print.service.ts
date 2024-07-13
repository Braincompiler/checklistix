import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

import { IChecklistVM } from '../mapper';

@Injectable()
export class PrintService {
    readonly #document = inject(DOCUMENT);

    public async print(checklist: IChecklistVM) {
        await this.#loadPrintCss(String(checklist.pageSize).toLowerCase(), String(checklist.pageOrientation).toLowerCase());

        window.print();

        this.#removePrintCss();
    }

    #loadPrintCss(pageSize: string, pageOrientation: string) {
        return new Promise<void>((resolve) => {
            const link = this.#document.createElement('link');

            link.id = 'print-css';
            link.rel = 'stylesheet';
            // link.type = 'text/css';
            link.href = `${pageSize}-${pageOrientation}.css`;
            link.media = 'print';
            link.onload = () => resolve();

            this.#document.head.appendChild(link);
        });
    }

    #removePrintCss() {
        const printCssLink = document.getElementById('print-css') as HTMLLinkElement;

        printCssLink?.remove();
    }
}
