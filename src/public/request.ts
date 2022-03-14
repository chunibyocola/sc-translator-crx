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
import custom from '../public/translate/custom';
import { bingSwitchLangCode, baiduSwitchLangCode } from '../public/switch-lang-code';
import { AudioCallback, DetectCallback, TranslateCallback } from './send';

type TranslateRequestParams = {
	source: string;
	text: string;
	from: string;
	to: string;
	com: boolean;
	preferredLanguage: string;
	secondPreferredLanguage: string;
};

export const translate = ({ source, ...requestParams }: TranslateRequestParams, cb: TranslateCallback) => {
	let translate;

	switch (source) {
		case GOOGLE_COM:
			translate = google.translate;
			break;
		case BING_COM:
			translate = bing.translate;
			requestParams.from = bingSwitchLangCode(requestParams.from);
			requestParams.to = bingSwitchLangCode(requestParams.to);
			requestParams.preferredLanguage = bingSwitchLangCode(requestParams.preferredLanguage);
			requestParams.secondPreferredLanguage = bingSwitchLangCode(requestParams.secondPreferredLanguage);
			break;
		case MOJIDICT_COM:
			translate = mojidict.translate;
			break;
		case BAIDU_COM:
			translate = baidu.translate;
			requestParams.from = baiduSwitchLangCode(requestParams.from);
			requestParams.to = baiduSwitchLangCode(requestParams.to);
			requestParams.preferredLanguage = baiduSwitchLangCode(requestParams.preferredLanguage);
			requestParams.secondPreferredLanguage = baiduSwitchLangCode(requestParams.secondPreferredLanguage);
			break;
		default:
			custom.translate(requestParams, source)
				.then(translation => cb({ translation }))
				.catch(err => cb({ code: err }));
			return;
	}
	
	translate(requestParams)
		.then(translation => cb({ translation }))
		.catch(err => cb({ code: err }));
};

type AudioRequestParams = {
	source: string;
	text: string;
	from: string;
	com: boolean;
};

export const audio = (requestParams: AudioRequestParams, cb: AudioCallback) => {
	let audio;
	switch (requestParams.source) {
		case GOOGLE_COM:
			audio = google.audio;
			break;
		case BING_COM:
			audio = bing.audio;
			requestParams.from = bingSwitchLangCode(requestParams.from ?? '');
			break;
		case BAIDU_COM:
			audio = baidu.audio;
			requestParams.from = baiduSwitchLangCode(requestParams.from ?? '');
			break;
		default:
			audio = google.audio;
			break;
	}

	audio(requestParams)
		.then(dataUri => cb({ dataUri }))
		.catch(err => cb({ code: err.code }));
};

type DetectRequestParams = {
	source: string;
	text: string;
	com: boolean;
};

export const detect = (requestParams: DetectRequestParams, cb: DetectCallback) => {
	let detect;
	switch (requestParams.source) {
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

	detect(requestParams)
		.then(langCode => cb({ langCode }))
		.catch(err => cb({ code: err.code }));
};