import * as types from '../../constants/chromeSendMessageTypes';
import {translate, audio} from '../../public/request';
import {playAudio} from './audio';

/* global chrome */

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
                    audio(payload, uri => playAudio(uri));
                }
                return false;
            default: break;
        }
    }
);