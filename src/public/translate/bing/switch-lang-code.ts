const switchToBingCodeMap = new Map(Object.entries({'zh-CN':'zh-Hans','zh-TW':'zh-Hant','tl':'fil','iw':'he','hmn':'mww','sr':'sr-Cyrl','no':'nb'}));
export const switchToBingLangCode = (code: string) => {
    return switchToBingCodeMap.get(code) ?? code;
};

const switchToGoogleCodeMap = new Map(Object.entries({'zh-Hans':'zh-CN','zh-Hant':'zh-TW','fil':'tl','he':'iw','mww':'hmn','sr-Cyrl':'sr','nb':'no'}));
export const switchToGoogleLangCode = (code: string) => {
    return switchToGoogleCodeMap.get(code) ?? code;
};