import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio, detect } from '../../public/request';
import { listenOptionsChange } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import { LANG_EN } from '../../constants/langCode';
import { createSeparateWindow } from './separate-window';
import { DefaultOptions } from '../../types';

let useDotCn = false;
let preferredLanguage = LANG_EN;
let secondPreferredLanguage = LANG_EN;

type PickedOptions = Pick<DefaultOptions, 'defaultAudioSource' | 'useDotCn' | 'preferredLanguage' | 'secondPreferredLanguage'>;
const keys: (keyof PickedOptions)[] = ['defaultAudioSource', 'useDotCn', 'preferredLanguage', 'secondPreferredLanguage'];
getLocalStorage<PickedOptions>(keys, (storage) => {
    useDotCn = storage.useDotCn;
    preferredLanguage = storage.preferredLanguage;
    secondPreferredLanguage = storage.secondPreferredLanguage;
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.useDotCn !== undefined && (useDotCn = changes.useDotCn);
    changes.preferredLanguage !== undefined && (preferredLanguage = changes.preferredLanguage);
    changes.secondPreferredLanguage !== undefined && (secondPreferredLanguage = changes.secondPreferredLanguage);
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        const { type, payload } = request;
        switch (type) {
            case types.SCTS_TRANSLATE:
                if (payload) {
                    payload.requestObj.com = !useDotCn;
                    payload.requestObj.preferredLanguage = preferredLanguage;
                    payload.requestObj.secondPreferredLanguage = secondPreferredLanguage;
                    translate(payload, (result) => {
                        sendResponse(result);
                    });
                }
                return true;
            case types.SCTS_AUDIO:
                if (payload) {
                    payload.com = !useDotCn;
                    audio(payload, (result) => {
                        sendResponse(result);
                    });
                }
                return true;
            case types.SCTS_DETECT:
                if (payload) {
                    payload.com = !useDotCn;
                    detect(payload, (result) => {
                        sendResponse(result);
                    });
                }
                return true;
            case types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW:
                payload?.text && createSeparateWindow(payload.text);
                return false;
            default: break;
        }
    }
);