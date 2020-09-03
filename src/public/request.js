import {
	GOOGLE_COM,
	BING_COM,
	MOJIDICT_COM,
	audioSource
} from '../constants/translateSource';
import google from 'google-translate-result';
import bing from 'bing-translate-result';
import mojidict from '../public/translate/mojidict';
import { getNavigatorLanguage } from './utils';

export const translate = ({ source, requestObj }, cb) => {
	let translate;
	switch (source) {
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_COM:
			translate = bing.translate;
			requestObj.from = langCodeSwitch(requestObj.from);
			requestObj.to = langCodeSwitch(requestObj.to);
			break;
		case MOJIDICT_COM:
			translate = mojidict.translate;
			break;
		default:
			let err = new Error();
			err.code = 'SOURCE_ERROR';
			cb({ suc: false, data: err });
			return;
	}

	requestObj.userLang = getNavigatorLanguage();
	
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
			requestObj.from = langCodeSwitch(requestObj.from);
			break;
		default:
			audio = google.audio;
			break;
	}

	audio(requestObj)
		.then(uri => cb && cb(uri))
		.catch(err => console.error(err.code));
};

// some translate source's lang code might different from google translate.
// like Bing's 'zh-Hans', 'zh-Hant', etc.
// switch it before using or after the result return.
const langCodeSwitch = (code) => {
	switch (code) {
		case 'zh-CN': return 'zh-Hans';
		case 'zh-TW': return 'zh-Hant';
		default: return code;
	}
};