const switchToBingCodeMap = new Map(Object.entries({'zh-CN':'zh-Hans','zh-TW':'zh-Hant','tl':'fil','iw':'he','hmn':'mww','sr':'sr-Cyrl','no':'nb'}));
export const switchToBingLangCode = (code: string) => {
    return switchToBingCodeMap.get(code) ?? code;
};

const switchToGoogleCodeMap = new Map(Object.entries({'zh-Hans':'zh-CN','zh-Hant':'zh-TW','fil':'tl','he':'iw','mww':'hmn','sr-Cyrl':'sr','nb':'no'}));
export const switchToGoogleLangCode = (code: string) => {
    return switchToGoogleCodeMap.get(code) ?? code;
};

const supportedLangCodes = new Set(['auto-detect','af','ar','bn','bs','bg','yue','ca','zh-Hans','zh-Hant','hr','cs','da','nl','en','et','fj','fil','fi','fr','de','el','gu','ht','he','hi','mww','hu','is','id','ga','it','ja','kn','kk','sw','ko','lv','lt','mg','ms','ml','mt','mi','mr','nb','fa','pl','pt','pt-PT','pa','ro','ru','sm','sr-Cyrl','sk','sl','es','sv','ty','ta','te','th','to','tr','uk','ur','vi','cy','yua']);
export const isLangCodeSupported = (code: string) => {
    return supportedLangCodes.has(code);
};