import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
    authEndpoint: 'http://localhost:9090',
    dataEndpoint: 'http://localhost:9091',
    // wsEndpoint: 'http://localhost:9092',
    production: false,
};
