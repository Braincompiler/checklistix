import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';

import { map } from 'rxjs';

export const dataInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return next(req).pipe(
        // tap((d) => console.log(d)),
        map((event) => {
            if (event instanceof HttpResponse && 'data' in (event.body as any)) {
                return event.clone({ body: (event.body as any).data });
            }

            return event;
        }),
    );
};
