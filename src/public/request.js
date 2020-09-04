import {
	GOOGLE_COM,
	BING_COM,
	MOJIDICT_COM,
	BAIDU_COM,
	audioSource
} from '../constants/translateSource';
import google from 'google-translate-result';
import bing from 'bing-translate-result';
import mojidict from '../public/translate/mojidict';
import baidu from '../public/translate/baidu';
import { getNavigatorLanguage } from './utils';

export const translate = ({ source, requestObj }, cb) => {
	let translate;

	requestObj.userLang = getNavigatorLanguage();

	switch (source) {
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_COM:
			translate = bing.translate;
			requestObj.from = bingSwitchLangCode(requestObj.from);
			requestObj.to = bingSwitchLangCode(requestObj.to);
			break;
		case MOJIDICT_COM:
			translate = mojidict.translate;
			break;
		case BAIDU_COM:
			translate = baidu.translate;
			requestObj.from = baiduSwitchLangCode(requestObj.from);
			requestObj.to = baiduSwitchLangCode(requestObj.to);
			requestObj.userLang = baiduSwitchLangCode(requestObj.userLang);
			break;
		default:
			let err = new Error();
			err.code = 'SOURCE_ERROR';
			cb({ suc: false, data: err });
			return;
	}
	
	translate(requestObj)
		.then(result => cb && cb({ suc: true, data: result }))
		.catch(err => cb && cb({ suc: false, data: err }));
};

export const audio = ({ source, requestObj, defaultSource }, cb) => {
	audioSource.findIndex(v => v.source === source) < 0 && (source = defaultSource);

	let audio;
	switch (source) {
		case GOOGLE_COM:
			audio = google.audio;
			break;
		case BING_COM:
			audio = bing.audio;
			requestObj.from = bingSwitchLangCode(requestObj.from);
			break;
		case BAIDU_COM:
			audio = baidu.audio;
			break;
		default:
			audio = google.audio;
			break;
	}

	audio(requestObj)
		.then(uri => cb && cb(uri))
		.catch(err => console.error(err.code));
};

// switch lang code for bing
const bingSwitchLangCode = (code) => {
	switch (code) {
		case 'zh-CN': return 'zh-Hans';
		case 'zh-TW': return 'zh-Hant';
		default: return code;
	}
};

// switch lang code for baidu
const baiduSwitchLangCode = (code) => {
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
        default: return code;
    }
};