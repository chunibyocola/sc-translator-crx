import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio } from '../../public/request';
import { playAudio } from './audio';
import { listenOptionsChange } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import { GOOGLE_COM } from '../../constants/translateSource';
import { LANG_EN } from '../../constants/langCode';

/* global chrome */

let defaultAudioSource = GOOGLE_COM;
let useDotCn = false;
let preferredLanguage = LANG_EN;
getLocalStorage(['defaultAudioSource', 'useDotCn', 'preferredLanguage'], (storage) => {
    defaultAudioSource = storage.defaultAudioSource;
    useDotCn = storage.useDotCn;
    preferredLanguage = storage.preferredLanguage;
});
listenOptionsChange(['defaultAudioSource', 'useDotCn', 'preferredLanguage'], (changes) => {
    'defaultAudioSource' in changes && (defaultAudioSource = changes.defaultAudioSource);
    'useDotCn' in changes && (useDotCn = changes.useDotCn);
    'preferredLanguage' in changes && (preferredLanguage = changes.preferredLanguage);
});

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        const {type, payload} = request;
        switch (type) {
            case types.SCTS_TRANSLATE:
                if (payload) {
                    payload.requestObj.com = !useDotCn;
                    payload.requestObj.userLang = preferredLanguage;
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
            default: break;
        }
    }
);