import {GOOGLE_CN} from '../constants/translateSource';
import google from 'google-translate-result';
import {getNavigatorLanguage} from './utils';

export const translate = ({source, requestObj}, cb) => {
	if (source === GOOGLE_CN) requestObj.com = false;

	requestObj.userLang = getNavigatorLanguage();
	
	google.translate(requestObj)
		.then(result => cb && cb({suc: true, data: result}))
		.catch(err => cb && cb({suc: false, data: err}));
};

export const audio = ({source, requestObj}, cb) => {
	if (source === GOOGLE_CN) requestObj.com = false;

	google.audio(requestObj)
		.then(uri => cb && cb(uri))
		.catch(err => console.error(err));
};