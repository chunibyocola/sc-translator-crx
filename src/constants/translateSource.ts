export const GOOGLE_COM = 'google.com';
export const BING_COM = 'bing.com';
export const MOJIDICT_COM = 'mojidict.com';
export const BAIDU_COM = 'baidu.com';

export type TranslateSource = {
    source: string;
    url: string;
};

export const translateSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: BING_COM, url: 'www.bing.com/translator/' },
    { source: MOJIDICT_COM, url: 'www.mojidict.com' },
    { source: BAIDU_COM, url: 'fanyi.baidu.com' }
];

export const audioSource: TranslateSource[] = [
    { source: GOOGLE_COM, url: 'translate.google.com' },
    { source: BING_COM, url: 'www.bing.com/translator/' },
    { source: BAIDU_COM, url: 'fanyi.baidu.com' }
];