import {
	GOOGLE_COM,
	BING_COM,
	MOJIDICT_COM,
	BAIDU_COM
} from '../constants/translateSource';
import google from '../public/translate/google';
import bing from '../public/translate/bing';
import mojidict from '../public/translate/mojidict';
import baidu from '../public/translate/baidu';
import { bingSwitchLangCode, baiduSwitchLangCode } from '../public/switch-lang-code';
import { SOURCE_ERROR } from '../constants/errorCodes';
import { AudioCallback, DetectCallback, TranslateCallback } from './send';
import { getError } from './translate/utils';

type TranslateRequestObject = {
	source: string;
	translateId: number;
	requestObj: {
		preferredLanguage: string;
		secondPreferredLanguage: string;
		text: string;
		from: string;
		to: string;
	}
}

export const translate = ({ source, translateId, requestObj }: TranslateRequestObject, cb: TranslateCallback) => {
	let translate;

	switch (source) {
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_COM:
			translate = bing.translate;
			requestObj.from = bingSwitchLangCode(requestObj.from);
			requestObj.to = bingSwitchLangCode(requestObj.to);
			requestObj.preferredLanguage = bingSwitchLangCode(requestObj.preferredLanguage);
			requestObj.secondPreferredLanguage = bingSwitchLangCode(requestObj.secondPreferredLanguage);
			break;
		case MOJIDICT_COM:
			translate = mojidict.translate;
			break;
		case BAIDU_COM:
			translate = baidu.translate;
			requestObj.from = baiduSwitchLangCode(requestObj.from);
			requestObj.to = baiduSwitchLangCode(requestObj.to);
			requestObj.preferredLanguage = baiduSwitchLangCode(requestObj.preferredLanguage);
			requestObj.secondPreferredLanguage = baiduSwitchLangCode(requestObj.secondPreferredLanguage);
			break;
		default:
			const err = getError(SOURCE_ERROR);
			cb?.({ suc: false, data: err, translateId });
			return;
	}
	
	translate(requestObj)
		.then(result => cb({ suc: true, data: result, translateId }))
		.catch(err => cb({ suc: false, data: err, translateId }));
};

type AudioRequestObject = {
	source: string;
	text: string;
	from: string;
	com: boolean;
	index: number;
};

export const audio = (requestObject: AudioRequestObject, cb: AudioCallback) => {
	let audio;
	switch (requestObject.source) {
		case GOOGLE_COM:
			audio = google.audio;
			break;
		case BING_COM:
			audio = bing.audio;
			requestObject.from = bingSwitchLangCode(requestObject.from ?? '');
			break;
		case BAIDU_COM:
			audio = baidu.audio;
			requestObject.from = baiduSwitchLangCode(requestObject.from ?? '');
			break;
		default:
			audio = google.audio;
			break;
	}

	audio(requestObject)
		.then(dataUri => cb({ suc: true, data: dataUri, text: requestObject.text, index: requestObject.index }))
		.catch(err => cb({ suc: false, code: err.code, text: requestObject.text, index: requestObject.index }));
};

type DetectRequestObject = {
	source: string;
	text: string;
	com: boolean;
};

export const detect = (requestObject: DetectRequestObject, cb: DetectCallback) => {
	let detect;
	switch (requestObject.source) {
		case GOOGLE_COM:
			detect = google.detect;
			break;
		case BING_COM:
			detect = bing.detect;
			break;
		case BAIDU_COM:
			detect = baidu.detect;
			break;
		default:
			detect = google.detect;
			break;
	}

	detect(requestObject)
		.then(langCode => cb({ suc: true, text: requestObject.text, data: langCode }))
		.catch(err => cb({ suc: false, code: err.code, text: requestObject.text }));
};