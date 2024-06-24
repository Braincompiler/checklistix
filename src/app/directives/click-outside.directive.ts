import { Directive, ElementRef, HostListener, inject, output } from '@angular/core';

@Directive({
    selector: '[cxClickOutside]',
    standalone: true,
})
export class ClickOutsideDirective {
    public readonly clickOutside = output({ alias: 'cxClickOutside' });

    readonly #elementRef = inject(ElementRef);

    @HostListener('document:click', ['$event'])
    public onClick(event: PointerEvent) {
        if (!this.#elementRef.nativeElement.contains(event.target)) {
            this.clickOutside.emit();
        }
    }
}
