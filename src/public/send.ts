import * as types from '../constants/chromeSendMessageTypes';
import { EXTENSION_UPDATED } from '../constants/errorCodes';
import { Translation } from '../redux/slice/multipleTranslateSlice';
import { TranslateResult } from '../types';

type ErrorResponse = {
    code: string;
};
type GenericResponse<Response> = Response | ErrorResponse;
type TranslateResponse = GenericResponse<{
    translation: TranslateResult;
}>;
type AudioResponse = GenericResponse<{
    dataUri: string;
}>;
type DetectResponse = GenericResponse<{
    langCode: string;
}>;
type IsCollectResponse = GenericResponse<{
    text: string;
    isCollected: boolean;
}>;

export type TranslateCallback = (response: TranslateResponse) => void;
export type AudioCallback = (response: AudioResponse) => void;
export type DetectCallback = (response: DetectResponse) => void;
export type IsCollectCallback = (response: IsCollectResponse) => void;

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
}> | GenericMessage<typeof types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW, {
    text: string;
}> | GenericMessage<typeof types.SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS, {
}> | GenericMessage<typeof types.SCTS_DETECT, {
    text: string;
    source: string;
}> | GenericMessage<typeof types.SCTS_AUDIO, {
    text: string;
    source: string;
    from: string;
}> | GenericMessage<typeof types.SCTS_TRANSLATE, {
    text: string;
    source: string;
    from: string;
    to: string;
}>;

export const sendTranslate = async (params: { text: string, source: string, from: string, to: string }, translateId: number) => {
    let response = await chromeRuntimeSendMessage<TranslateResponse>({ type: types.SCTS_TRANSLATE, payload: params });

    return { ...response, translateId };
};

export const sendAudio = (text: string, source: string, from: string) => {
    return chromeRuntimeSendMessage<AudioResponse>({ type: types.SCTS_AUDIO, payload: { text, source, from } });
};

export const sendDetect = (text: string, source: string) => {
    return chromeRuntimeSendMessage<DetectResponse>({ type: types.SCTS_DETECT, payload: { text, source } });
};

export const sendSeparate = (text: string) => {
    return chromeRuntimeSendMessage({ type: types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW, payload: { text } });
};

export const sendSyncSettingsToOtherBrowsers = () => {
    return chromeRuntimeSendMessage({ type: types.SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS, payload: {} });
};

export const sendIsCollected = (text: string) => {
    return chromeRuntimeSendMessage<IsCollectResponse>({ type: types.SCTS_IS_COLLECTED, payload: { text } });
};

export const sendAddToCollection = (text: string, translations: Translation[]) => {
    return chromeRuntimeSendMessage({ type: types.SCTS_ADD_TO_COLLECTION, payload: { text, translations } });
};

export const sendRemoveFromCollection = (text: string) => {
    return chromeRuntimeSendMessage({ type: types.SCTS_REMOVE_FROM_COLLECTION, payload: { text } });
};

const chromeRuntimeSendMessage = <T = null>(message: ChromeRuntimeMessage): Promise<T | ErrorResponse> => {
    return new Promise((resolve) => {
        try {
            chrome.runtime.sendMessage(message, (response: T) => {
                if (chrome.runtime.lastError) {
                    resolve({ code: chrome.runtime.lastError.message ?? 'UNKNOWN_ERROR' });
                }

                resolve(response);
            });
        }
        catch {
            resolve({ code: EXTENSION_UPDATED });
        }
    });
};