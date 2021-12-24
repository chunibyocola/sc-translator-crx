import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio, detect } from '../../public/request';
import { createSeparateWindow } from './separate-window';
import { DefaultOptions } from '../../types';
import { getLocalStorageAsync } from '../../public/utils';
import { syncSettingsToOtherBrowsers } from './sync';

type TranslatePickedOptions = Pick<DefaultOptions, 'useDotCn' | 'preferredLanguage' | 'secondPreferredLanguage'>;
const translatePickedKeys: (keyof TranslatePickedOptions)[] = ['useDotCn', 'preferredLanguage', 'secondPreferredLanguage'];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { type, payload } = request;
    switch (type) {
        case types.SCTS_TRANSLATE:
            getLocalStorageAsync<TranslatePickedOptions>(translatePickedKeys).then((data) => {
                payload.requestObj.com = !data.useDotCn;
                payload.requestObj.preferredLanguage = data.preferredLanguage;
                payload.requestObj.secondPreferredLanguage = data.secondPreferredLanguage;

                translate(payload, (result) => {
                    sendResponse(result);
                });
            });

            return true;
        case types.SCTS_AUDIO:
            getLocalStorageAsync<Pick<DefaultOptions, 'useDotCn'>>(['useDotCn']).then((data) => {
                payload.com = !data.useDotCn;

                audio(payload, (result) => {
                    sendResponse(result);
                });
            });

            return true;
        case types.SCTS_DETECT:
            getLocalStorageAsync<Pick<DefaultOptions, 'useDotCn'>>(['useDotCn']).then((data) => {
                payload.com = !data.useDotCn;

                detect(payload, (result) => {
                    sendResponse(result);
                });
            });

            return true;
        case types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW:
            payload?.text && createSeparateWindow(payload.text);

            return false;
        case types.SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS:
            syncSettingsToOtherBrowsers();

            return false;
        default: break;
    }
});