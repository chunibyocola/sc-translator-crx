type SwitchLangCodesObject = { [K: string]: string; };

// switch lang code for bing
const googleToBingLangCodes: SwitchLangCodesObject = {'zh-CN':'zh-Hans','zh-TW':'zh-Hant','tl':'fil','iw':'he','hmn':'mww','sr':'sr-Cyrl'};
const bingToGoogleLangCodes: SwitchLangCodesObject = {'zh-Hans':'zh-CN','zh-Hant':'zh-TW','fil':'tl','he':'iw','mww':'hmn','sr-Cyrl':'sr'};

export const bingSwitchLangCode = (code: string) => {
    return googleToBingLangCodes[code] ?? code;
};

export const bingSwitchToGoogleLangCode = (code: string) => {
    return bingToGoogleLangCodes[code] ?? code;
};