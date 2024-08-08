import { BING_COM } from './translateSource';

// Use for users updating their computer time.
type UpdateTime = {
    updateTime: number
};

type BingParams = {
    translate: {
        expiry: number;
        key: number;
        token: string;
        IG: string;
        IID: string;
        richIID: string;
    } & UpdateTime;
    audio: {
        expiry: number;
        region: string;
        token: string;
    } & UpdateTime;
};

export type SourceParams = {
    [BING_COM]: BingParams;
};

export const initSourceParams: SourceParams = {
    [BING_COM]: {
        translate: {
            expiry: 0,
            key: 0,
            token: '',
            IG: 'IG',
            IID: 'translator.5027',
            richIID: 'translator.5024.1',
            updateTime: 0
        },
        audio: {
            expiry: 0,
            region: '',
            token: '',
            updateTime: 0
        }
    }
};