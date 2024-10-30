import { inject, Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AppStore } from '../app.store';
import { IChecklistVM } from '../mapper';

export enum WSMessageType {
    UpdateChecklist = 'UpdateChecklist',
}

@Injectable()
export class WsService implements OnDestroy {
    readonly #appStore = inject(AppStore);

    readonly #ws = new WebSocket(environment.wsEndpoint, ['Authorization', this.#userAccessToken]);
    readonly #responseSubject = new Subject<string>();
    readonly #connectionStatusSubject = new BehaviorSubject<boolean>(false);

    public readonly response$ = this.#responseSubject.asObservable();
    public readonly isOnline$ = this.#connectionStatusSubject.asObservable();

    get #userAccessToken(): string {
        const user = this.#appStore.user();
        if (user) {
            return user.access_token;
        }

        return '';
    }

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
            if (ev.data !== 'null') {
                console.log(ev);
                this.#responseSubject.next(ev.data);
            }
        };
    }

    public ngOnDestroy(): void {
        this.closeConnection();
    }

    public updateChecklist(checklist: IChecklistVM) {
        this.#ws.send(
            JSON.stringify({
                type: WSMessageType.UpdateChecklist,
                data: checklist,
            }),
        );
    }

    public closeConnection(): void {
        this.#ws.close(1000);
    }
}
