import * as types from '../constants/chromeSendMessageTypes';
import { EXTENSION_UPDATED } from '../constants/errorCodes';

export const sendTranslate = (text, { source, from, to, translateId }, cb = undefined) => {
    const action = {
        type: types.SCTS_TRANSLATE,
        payload: packData(text, { source, from, to, translateId })
    };

    chromeSendMessage(action, cb);
};

export const sendAudio = (text, { source = '', from = '' }) => {
    const action = {
        type: types.SCTS_AUDIO,
        payload: packData(text, { source, from })
    };

    chromeSendMessage(action);
};

export const sendSeparate = (text) => {
    chromeSendMessage({
        type: types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW,
        payload: { text }
    });
};

const packData = (text, { source, from, to = undefined, translateId = undefined }) => ({
    source,
    translateId,
	requestObj: {
		text,
		from,
        to
	}
});

const chromeSendMessage = (action, cb = undefined) => {
    try {
        chrome.runtime.sendMessage(action, cb);
    }
    catch {
        const translateId = action?.payload?.translateId;
        let err = new Error();
        err.code = EXTENSION_UPDATED;
        cb?.({ suc: false, data: err, translateId });
    }
};