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

// switch lang code for baidu
const googleToBaiduLangCodes: SwitchLangCodesObject = {'zh-CN':'zh','en':'en','ja':'jp','th':'th','es':'spa','ar':'ara','fr':'fra','ko':'kor','ru':'ru','de':'de','pt':'pt','it':'it','el':'el','nl':'nl','pl':'pl','fi':'fin','cs':'cs','bg':'bul','da':'dan','et':'est','hu':'hu','ro':'rom','sv':'swe','vi':'vie','zh-TW':'cht','be':'bel','my':'bur','tl':'fil','hi':'hi','is':'ice','id':'id','ga':'gle','kk':'kaz','lo':'lao','la':'lat','lb':'ltz','mk':'mac','ms':'may','ne':'nep','fa':'per','sr':'srp','sk':'sk','tr':'tr','uk':'ukr','uz':'uzb','haw':'haw','mi':'mao','no':'nor','eo':'epo'};
const baiduToGoogleLangCodes: SwitchLangCodesObject = {'zh':'zh-CN','en':'en','jp':'ja','th':'th','spa':'es','ara':'ar','fra':'fr','kor':'ko','ru':'ru','de':'de','pt':'pt','it':'it','el':'el','nl':'nl','pl':'pl','fin':'fi','cs':'cs','bul':'bg','dan':'da','est':'et','hu':'hu','rom':'ro','swe':'sv','vie':'vi','cht':'zh-TW','bel':'be','bur':'my','fil':'tl','hi':'hi','ice':'is','id':'id','gle':'ga','kaz':'kk','lao':'lo','lat':'la','ltz':'lb','mac':'mk','may':'ms','nep':'ne','per':'fa','srp':'sr','sk':'sk','tr':'tr','ukr':'uk','uzb':'uz','haw':'haw','mao':'mi','nor':'no','epo':'eo'};

export const baiduSwitchLangCode = (code: string) => {
    return googleToBaiduLangCodes[code] ?? code;
};

export const baiduSwitchToGoogleLangCode = (code: string) => {
    return baiduToGoogleLangCodes[code] ?? code;
};