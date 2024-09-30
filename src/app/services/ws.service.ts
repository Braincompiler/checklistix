import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class WsService implements OnDestroy {
    readonly #ws = new WebSocket(environment.wsEndpoint);
    readonly #responseSubject = new Subject<string>();
    readonly #connectionStatusSubject = new BehaviorSubject<boolean>(false);

    public readonly response$ = this.#responseSubject.asObservable();
    public readonly isOnline$ = this.#connectionStatusSubject.asObservable();

    public constructor() {
        this.#ws.onopen = () => {
            this.#connectionStatusSubject.next(true);
        };
        this.#ws.onclose = () => {
            this.#connectionStatusSubject.next(false);
        };

        this.#ws.onerror = (e) => {
            console.error(e);
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
