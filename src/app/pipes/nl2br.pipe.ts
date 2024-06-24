import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'cxNl2Br',
    standalone: true,
})
export class Nl2brPipe implements PipeTransform {
    readonly #sanitizer = inject(DomSanitizer);

    public transform(value: string): SafeHtml {
        return this.#sanitizer.bypassSecurityTrustHtml(value.replaceAll(/\n/g, '<br/>'));
    }
}
