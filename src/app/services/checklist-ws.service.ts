import { inject, Injectable } from '@angular/core';

import { WsService } from './ws.service';

@Injectable()
export class ChecklistWSService {
    readonly #ws = inject(WsService);
}
