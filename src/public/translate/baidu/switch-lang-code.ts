const switchToBaiduCodeMap = new Map(Object.entries({'zh-CN':'zh','en':'en','ja':'jp','th':'th','es':'spa','ar':'ara','fr':'fra','ko':'kor','ru':'ru','de':'de','pt':'pt','it':'it','el':'el','nl':'nl','pl':'pl','fi':'fin','cs':'cs','bg':'bul','da':'dan','et':'est','hu':'hu','ro':'rom','sv':'swe','vi':'vie','zh-TW':'cht','be':'bel','my':'bur','tl':'fil','hi':'hi','is':'ice','id':'id','ga':'gle','kk':'kaz','lo':'lao','la':'lat','lb':'ltz','mk':'mac','ms':'may','ne':'nep','fa':'per','sr':'srp','sk':'sk','tr':'tr','uk':'ukr','uz':'uzb','haw':'haw','mi':'mao','no':'nor','eo':'epo'}));
export const switchToBaiduLangCode = (code: string) => {
    return switchToBaiduCodeMap.get(code) ?? code;
};

const switchToGoogleCodeMap = new Map(Object.entries({'zh':'zh-CN','en':'en','jp':'ja','th':'th','spa':'es','ara':'ar','fra':'fr','kor':'ko','ru':'ru','de':'de','pt':'pt','it':'it','el':'el','nl':'nl','pl':'pl','fin':'fi','cs':'cs','bul':'bg','dan':'da','est':'et','hu':'hu','rom':'ro','swe':'sv','vie':'vi','cht':'zh-TW','bel':'be','bur':'my','fil':'tl','hi':'hi','ice':'is','id':'id','gle':'ga','kaz':'kk','lao':'lo','lat':'la','ltz':'lb','mac':'mk','may':'ms','nep':'ne','per':'fa','srp':'sr','sk':'sk','tr':'tr','ukr':'uk','uzb':'uz','haw':'haw','mao':'mi','nor':'no','epo':'eo'}));
export const switchToGoogleLangCode = (code: string) => {
    return switchToGoogleCodeMap.get(code) ?? code;
};

const supportedLangCodes = new Set(['auto','zh','en','jp','th','spa','ara','fra','kor','ru','de','pt','it','el','nl','pl','fin','cs','bul','dan','est','hu','rom','swe','vie','yue','cht','bel','bur','fil','hi','ice','id','gle','kaz','lao','lat','ltz','mac','may','nep','per','srp','sk','tr','ukr','uzb','haw','mao','nor','epo']);
export const isLangCodeSupported = (code: string) => {
    return supportedLangCodes.has(code);
};