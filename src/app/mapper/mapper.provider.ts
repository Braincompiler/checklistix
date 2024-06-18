import { InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';

import { IMapper } from './mapper.interface';

export const MAPPERS = new InjectionToken<readonly IMapper<any, any>[]>('MAPPERS');

export enum MapperFeatureKind {
    MAPPER,
}

export interface IMapperFeature {
    kind: MapperFeatureKind;
    providers: Provider[];
}

export function withMapper<TDTO, TVM, TMapper extends IMapper<TDTO, TVM>>(...mapper: TMapper[]): IMapperFeature {
    return {
        kind: MapperFeatureKind.MAPPER,
        providers: [
            // @TODO: Validate if a mapper for the given type id (.for()) already exists
            ...mapper.map((m) => ({
                provide: MAPPERS,
                useValue: m,
                multi: true,
            })),
        ],
    };
}

export function provideMapper(...mapperFeatures: IMapperFeature[]) {
    return makeEnvironmentProviders([
        // MapperService, //
        ...mapperFeatures.map((f) => f.providers),
    ]);
}
