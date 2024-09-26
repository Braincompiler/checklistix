import { Injectable, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class WSService implements OnDestroy {
    readonly #ws = new WebSocket(environment.wsEndpoint);
    readonly #responseSubject = new Subject<string>();

    public readonly response = toSignal<string>(this.#responseSubject.asObservable());

    public constructor() {
        this.#ws.onopen = () => {
            console.log('connected');
        };

        this.#ws.onmessage = (ev) => {
            console.log(ev);

            this.#responseSubject.next(ev.data);
        };
    }

    public ngOnDestroy(): void {
        this.closeConnection();
    }

    public sendMsg(msg: string) {
        this.#ws.send(
            JSON.stringify({
                type: 'msg',
                data: msg,
            }),
        );
    }

    public closeConnection(): void {
        this.#ws.close(1000);
    }
}
