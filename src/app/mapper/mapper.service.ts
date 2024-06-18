import { inject, Injectable } from '@angular/core';

import { isNil } from 'ramda';

import { MAPPERS } from './mapper.provider';

@Injectable({ providedIn: 'root' })
export class MapperService {
    readonly #mappers = inject(MAPPERS);

    public async mapToVM<TSrc, TDest>(typeId: string, src: TSrc): Promise<TDest> {
        const mapper = this.#mappers.find((m) => m.for() === typeId);
        if (isNil(mapper)) {
            throw new Error(`No mapper found for '${typeId}'`);
        }

        return mapper.mapToVM(src);
    }

    public async mapToDTO<TSrc, TDest>(typeId: string, src: TSrc): Promise<TDest> {
        const mapper = this.#mappers.find((m) => m.for() === typeId);
        if (isNil(mapper)) {
            throw new Error(`No mapper found for '${typeId}'`);
        }

        return mapper.mapToDTO(src);
    }
}
