import { BAIDU_COM, BING_COM } from './translateSource';

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
    } & UpdateTime;
    audio: {
        expiry: number;
        region: string;
        token: string;
    } & UpdateTime;
};

type BaiduParams = {
    translate: {
        expiry: number;
        token: string;
    } & UpdateTime;
};

export type SourceParams = {
    [BING_COM]: BingParams;
    [BAIDU_COM]: BaiduParams;
};

export const initSourceParams: SourceParams = {
    [BING_COM]: {
        translate: {
            expiry: 0,
            key: 0,
            token: '',
            IG: 'IG',
            updateTime: 0
        },
        audio: {
            expiry: 0,
            region: '',
            token: '',
            updateTime: 0
        }
    },
    [BAIDU_COM]: {
        translate: {
            expiry: 0,
            token: '',
            updateTime: 0
        }
    }
};