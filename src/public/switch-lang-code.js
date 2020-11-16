// switch lang code for bing
export const bingSwitchLangCode = (code) => {
	switch (code) {
		case 'zh-CN': return 'zh-Hans';
		case 'zh-TW': return 'zh-Hant';
		case 'tl': return 'fil';
		case 'iw': return 'he';
		case 'hmn': return 'mww';
		case 'sr': return 'sr-Cyrl';
		default: return code;
	}
};

// switch lang code for baidu
export const baiduSwitchLangCode = (code) => {
    switch (code) {
        case 'zh-CN': return 'zh';
        case 'en': return 'en';
        case 'ja': return 'jp';
        case 'th': return 'th';
        case 'es': return 'spa';
        case 'ar': return 'ara';
        case 'fr': return 'fra';
        case 'ko': return 'kor';
        case 'ru': return 'ru';
        case 'de': return 'de';
        case 'pt': return 'pt';
        case 'it': return 'it';
        case 'el': return 'el';
        case 'nl': return 'nl';
        case 'pl': return 'pl';
        case 'fi': return 'fin';
        case 'cs': return 'cs';
        case 'bg': return 'bul';
        case 'da': return 'dan';
        case 'et': return 'est';
        case 'hu': return 'hu';
        case 'ro': return 'rom';
        case 'sv': return 'swe';
        case 'vi': return 'vie';
        case 'zh-TW': return 'cht';
        case 'be': return 'bel';
        case 'my': return 'bur';
        case 'tl': return 'fil';
        case 'hi': return 'hi';
        case 'is': return 'ice';
        case 'id': return 'id';
        case 'ga': return 'gle';
        case 'kk': return 'kaz';
        case 'lo': return 'lao';
        case 'la': return 'lat';
        case 'lb': return 'ltz';
        case 'mk': return 'mac';
        case 'ms': return 'may';
        case 'ne': return 'nep';
        case 'fa': return 'per';
        case 'sr': return 'srp';
        case 'sk': return 'sk';
        case 'tr': return 'tr';
        case 'uk': return 'ukr';
        case 'uz': return 'uzb';
        case 'haw': return 'haw';
        case 'mi': return 'mao';
		case 'no': return 'nor';
		case 'eo': return 'epo';
        default: return code;
    }
};