import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio } from '../../public/request';
import { playAudio } from './audio';
import { listenOptionsChange } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import { GOOGLE_COM } from '../../constants/translateSource';
import { LANG_EN } from '../../constants/langCode';
import { createSeparateWindow } from './separate-window';
import { removeSinglePermission, requestSinglePermission } from './optional-permissions';

let defaultAudioSource = GOOGLE_COM;
let useDotCn = false;
let preferredLanguage = LANG_EN;
let secondPreferredLanguage = LANG_EN;
getLocalStorage(['defaultAudioSource', 'useDotCn', 'preferredLanguage', 'secondPreferredLanguage'], (storage) => {
    defaultAudioSource = storage.defaultAudioSource;
    useDotCn = storage.useDotCn;
    preferredLanguage = storage.preferredLanguage;
    secondPreferredLanguage = storage.secondPreferredLanguage;
});
listenOptionsChange(['defaultAudioSource', 'useDotCn', 'preferredLanguage', 'secondPreferredLanguage'], (changes) => {
    'defaultAudioSource' in changes && (defaultAudioSource = changes.defaultAudioSource);
    'useDotCn' in changes && (useDotCn = changes.useDotCn);
    'preferredLanguage' in changes && (preferredLanguage = changes.preferredLanguage);
    'secondPreferredLanguage' in changes && (secondPreferredLanguage = changes.secondPreferredLanguage);
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
                    payload.requestObj.com = !useDotCn;
                    !payload.source && (payload.source = defaultAudioSource);
                    payload.defaultSource = defaultAudioSource;
                    audio(payload, uri => playAudio(uri));
                }
                return false;
            case types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW:
                payload?.text && createSeparateWindow(payload.text);
                return false;
            case types.SCTS_REQUEST_SINGLE_PERMISSION:
                payload?.permissionName && requestSinglePermission(payload.permissionName);
                return false;
            case types.SCTS_REMOVE_SINGLE_PERMISSION:
                payload?.permissionName && removeSinglePermission(payload.permissionName);
                return false;
            default: break;
        }
    }
);