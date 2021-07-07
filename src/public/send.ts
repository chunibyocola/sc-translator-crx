import * as types from '../constants/chromeSendMessageTypes';
import { EXTENSION_UPDATED } from '../constants/errorCodes';
import { TranslateResult } from '../types';

type TranslateResponse = {
    suc: false;
    data: Error & { code: string };
    translateId: number;
} | {
    suc: true;
    data: TranslateResult;
    translateId: number;
};

export type TranslateCallback = (response: TranslateResponse) => void;
type SendTranslatePayload = {
    source: string;
    translateId: number;
    requestObj: {
        text: string;
        from: string;
        to: string;
    }
};
type SendAudioPayload = {
    source: string;
    requestObj: {
        text: string;
        from: string;
    }
};
type SendSeparatePayload = {
    text: string;
};
type SendAction = {
    type: string;
    payload: SendTranslatePayload | SendAudioPayload | SendSeparatePayload;
};

export const sendTranslate = (text: string, { source, from, to, translateId }: { source: string, from: string, to: string, translateId: number }, cb?: TranslateCallback) => {
    const action = {
        type: types.SCTS_TRANSLATE,
        payload: packData(text, { source, from, to, translateId })
    };

    chromeSendMessage(action, cb);
};

export const sendAudio = (text: string, { source = '', from = '' }) => {
    const action = {
        type: types.SCTS_AUDIO,
        payload: packData(text, { source, from })
    };

    chromeSendMessage(action);
};

export const sendSeparate = (text: string) => {
    chromeSendMessage({
        type: types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW,
        payload: { text }
    });
};

const packData = (text: string, { source, from, to, translateId }: { source: string, from: string, to?: string, translateId?: number }) => ({
    source,
    translateId,
	requestObj: {
		text,
		from,
        to
	}
});

const chromeSendMessage = (action: SendAction, cb?: TranslateCallback) => {
    try {
        chrome.runtime.sendMessage(action, cb);
    }
    catch {
        if (!('translateId' in action?.payload)) { return; }

        const translateId = action.payload.translateId;
        let err: any = new Error();
        err.code = EXTENSION_UPDATED;
        cb?.({ suc: false, data: err, translateId });
    }
};