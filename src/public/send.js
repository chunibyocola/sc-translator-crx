import * as types from '../constants/chromeSendMessageTypes';

export const sendTranslate = (text, {source, from, to}, cb = undefined) => {
    const action = {
        type: types.SCTS_TRANSLATE,
        payload: packData(text, {source, from, to})
    };

    chromeSendMessage(action, cb);
};

export const sendAudio = (text, {source = '', from = ''}) => {
    const action = {
        type: types.SCTS_AUDIO,
        payload: packData(text, {source, from})
    };

    chromeSendMessage(action);
};

const packData = (text, {source, from, to = undefined}) => ({
	source,
	requestObj: {
		text,
		from,
		to
	}
});

/* global chrome */
const chromeSendMessage = (action, cb = undefined) => {
    chrome.runtime.sendMessage(action, cb);
};