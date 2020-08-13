import {
	GOOGLE_CN,
	GOOGLE_COM,
	BING_CN,
	BING_COM,
	MOJIDICT_COM,
	audioSource
} from '../constants/translateSource';
import google from 'google-translate-result';
import bing from '../public/translate/bing';
import mojidict from '../public/translate/mojidict';
import {getNavigatorLanguage} from './utils';

export const translate = ({source, requestObj}, cb) => {
	let translate;
	switch (source) {
		case GOOGLE_CN:
			translate = google.translate;
			requestObj.com = false;
			break;
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_CN:
			translate = bing.translate;
			requestObj.com = false;
			break;
		case BING_COM:
			translate = bing.translate;
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
		.then(result => cb && cb({suc: true, data: result}))
		.catch(err => cb && cb({suc: false, data: err}));
};

export const audio = ({source, requestObj, defaultSource}, cb) => {
	audioSource.findIndex(v => v.source === source) < 0 && (source = defaultSource);

	let audio;
	switch (source) {
		case GOOGLE_CN:
			audio = google.audio;
			requestObj.com = false;
			break;
		case GOOGLE_COM:
			audio = google.audio;
			break;
		default:
			audio = google.audio;
			break;
	}

	audio(requestObj)
		.then(uri => cb && cb(uri))
		.catch(err => console.error(err));
};