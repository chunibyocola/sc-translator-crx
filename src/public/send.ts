import * as types from '../constants/chromeSendMessageTypes';
import { EXTENSION_UPDATED } from '../constants/errorCodes';
import { Translation } from '../redux/slice/multipleTranslateSlice';
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
type AudioResponse = {
    suc: false;
    text: string;
    index: number;
    code: string;
} | {
    suc: true;
    text: string;
    index: number;
    data: string;
};
type DetectResponse = {
    suc: false;
    text: string;
    code: string;
} | {
    suc: true;
    text: string;
    data: string;
};
type IsCollectResponse = {
    text: string;
    isCollected: boolean;
} | {
    code: string;
};

export type TranslateCallback = (response: TranslateResponse) => void;
export type AudioCallback = (response: AudioResponse) => void;
export type DetectCallback = (response: DetectResponse) => void;
export type IsCollectCallback = (response: IsCollectResponse) => void;

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

type GenericMessage<ActionType, ActionPayload> = {
    type: ActionType;
    payload: ActionPayload;
}
export type ChromeRuntimeMessage = GenericMessage<typeof types.SCTS_IS_COLLECTED, {
    text: string;
}> | GenericMessage<typeof types.SCTS_ADD_TO_COLLECTION, {
    text: string;
    translations: Translation[];
}> | GenericMessage<typeof types.SCTS_REMOVE_FROM_COLLECTION, {
    text: string;
}>;

export const sendTranslate = (text: string, { source, from, to, translateId }: { source: string, from: string, to: string, translateId: number }, cb?: TranslateCallback) => {
    const action = {
        type: types.SCTS_TRANSLATE,
        payload: packData(text, { source, from, to, translateId })
    };

    chromeSendMessage(action, cb);
};

export const sendAudio = ({ text, source, from, index }: { text: string; source: string; from: string; index: number }, cb: AudioCallback) => {
    const action = {
        type: types.SCTS_AUDIO,
        payload: { text, source, from, index }
    };

    try {
        chrome.runtime.sendMessage(action, cb);
    }
    catch {
        cb({ suc: false, text, code: EXTENSION_UPDATED, index });
    }
};

export const sendDetect = ({ text, source }: { text: string; source: string; }, cb: DetectCallback) => {
    const action = {
        type: types.SCTS_DETECT,
        payload: { text, source }
    };

    try {
        chrome.runtime.sendMessage(action, cb);
    }
    catch {
        cb({ suc: false, text, code: EXTENSION_UPDATED });
    }
};

export const sendSeparate = (text: string) => {
    chromeSendMessage({
        type: types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW,
        payload: { text }
    });
};

export const sendIsCollected = (text: string, callback: IsCollectCallback) => {
    chromeRuntimeSendMessage({ type: types.SCTS_IS_COLLECTED, payload: { text } }, callback);
};

export const sendAddToCollection = (text: string, translations: Translation[]) => {
    chromeRuntimeSendMessage({ type: types.SCTS_ADD_TO_COLLECTION, payload: { text, translations } });
};

export const sendRemoveFromCollection = (text: string) => {
    chromeRuntimeSendMessage({ type: types.SCTS_REMOVE_FROM_COLLECTION, payload: { text } });
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

// New send message API here. Will be combined with `chromeSendMessage`.
const chromeRuntimeSendMessage = (message: ChromeRuntimeMessage, callback?: (response: any) => void) => {
    try {
        chrome.runtime.sendMessage(message, callback);
    }
    catch {
        callback?.({ code: EXTENSION_UPDATED });
    }
};

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