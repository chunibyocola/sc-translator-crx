import {
	GOOGLE_COM,
	BING_COM,
	MOJIDICT_COM,
	BAIDU_COM,
	audioSource
} from '../constants/translateSource';
import google from '../public/translate/google';
import bing from '../public/translate/bing';
import mojidict from '../public/translate/mojidict';
import baidu from '../public/translate/baidu';
import { bingSwitchLangCode, baiduSwitchLangCode } from '../public/switch-lang-code';

export const translate = ({ source, translateId, requestObj }, cb) => {
	let translate;

	switch (source) {
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_COM:
			translate = bing.translate;
			requestObj.from = bingSwitchLangCode(requestObj.from);
			requestObj.to = bingSwitchLangCode(requestObj.to);
			requestObj.userLang = bingSwitchLangCode(requestObj.userLang);
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
		.then((result) => {
			'raw' in result && delete result['raw'];
			cb && cb({ suc: true, data: result, translateId });
		})
		.catch(err => cb && cb({ suc: false, data: err, translateId }));
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