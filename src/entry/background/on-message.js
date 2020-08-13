import * as types from '../../constants/chromeSendMessageTypes';
import {translate, audio} from '../../public/request';
import {playAudio} from './audio';
import { listenOptionsChange } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import { GOOGLE_COM } from '../../constants/translateSource';

/* global chrome */

let defaultAudioSource = GOOGLE_COM;
getLocalStorage('defaultAudioSource', storage => defaultAudioSource = storage.defaultAudioSource);
listenOptionsChange(['defaultAudioSource'], changes => defaultAudioSource = changes.defaultAudioSource);

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        const {type, payload} = request;
        switch (type) {
            case types.SCTS_TRANSLATE:
                if (payload) {
                    translate(payload, (result) => {
                        sendResponse(result);
                    });
                }
                return true;
            case types.SCTS_AUDIO:
                if (payload) {
                    !payload.source && (payload.source = defaultAudioSource);
                    payload.defaultSource = defaultAudioSource;
                    audio(payload, uri => playAudio(uri));
                }
                return false;
            default: break;
        }
    }
);