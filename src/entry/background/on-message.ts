import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio, detect } from '../../public/request';
import { createSeparateWindow } from './separate-window';
import { DefaultOptions } from '../../types';
import { getLocalStorageAsync } from '../../public/utils';
import { syncSettingsToOtherBrowsers } from './sync';
import scIndexedDB, { DB_STORE_COLLECTION } from '../../public/sc-indexed-db';
import { AudioResponse, ChromeRuntimeMessage, DetectResponse, IsCollectResponse, TranslateResponse } from '../../public/send';

type TypedSendResponse = (response: TranslateResponse | AudioResponse | DetectResponse | IsCollectResponse) => void;

chrome.runtime.onMessage.addListener((message: ChromeRuntimeMessage, sender, sendResponse: TypedSendResponse) => {
    switch (message.type) {
        case types.SCTS_TRANSLATE: {
            type TranslatePickedOptions = Pick<DefaultOptions, 'useDotCn' | 'preferredLanguage' | 'secondPreferredLanguage'>;
            const translatePickedKeys: (keyof TranslatePickedOptions)[] = ['useDotCn', 'preferredLanguage', 'secondPreferredLanguage'];

            getLocalStorageAsync<TranslatePickedOptions>(translatePickedKeys)
                .then(({ useDotCn, ...preferred }) => (translate({ ...message.payload, com: !useDotCn, ...preferred })))
                .then(sendResponse);

            return true;
        }
        case types.SCTS_AUDIO: {
            getLocalStorageAsync<Pick<DefaultOptions, 'useDotCn'>>(['useDotCn'])
                .then(({ useDotCn }) => (audio({ ...message.payload, com: !useDotCn })))
                .then(sendResponse);

            return true;
        }
        case types.SCTS_DETECT: {
            getLocalStorageAsync<Pick<DefaultOptions, 'useDotCn'>>(['useDotCn'])
                .then(({ useDotCn }) => (detect({ ...message.payload, com: !useDotCn })))
                .then(sendResponse);

            return true;
        }
        case types.SCTS_SEND_TEXT_TO_SEPARATE_WINDOW: {
            const { text } = message.payload;

            text && createSeparateWindow(text);

            return false;
        }
        case types.SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS: {
            syncSettingsToOtherBrowsers();

            return false;
        }
        case types.SCTS_IS_COLLECTED: {
            let { text } = message.payload;

            text = text.trimLeft().trimRight();

            if (text) {
                scIndexedDB.get(DB_STORE_COLLECTION, text)
                    .then(value => sendResponse({ text: message.payload.text, isCollected: !!value }))
                    .catch(() => sendResponse({ code: '' }));
            }
            else {
                sendResponse({ code: 'EMPTY_TEXT' });
            }

            return true;
        }
        case types.SCTS_ADD_TO_COLLECTION: {
            let { text, translations } = message.payload;

            text = text.trimStart().trimEnd();

            text && scIndexedDB.get(DB_STORE_COLLECTION, text).then((value) => {
                if (value) {
                    const translationMap = new Map([...value.translations, ...translations].map((v) => ([v.source, v.translateRequest])));

                    const nextTranslations: typeof value.translations = [...translationMap.entries()].map(([k, v]) => ({ source: k, translateRequest: v }));

                    scIndexedDB.add(DB_STORE_COLLECTION, { ...value, date: Number(new Date()), translations: nextTranslations });
                }
                else {
                    scIndexedDB.add(DB_STORE_COLLECTION, { text, date: Number(new Date()), translations });
                }
            });

            return false;
        }
        case types.SCTS_REMOVE_FROM_COLLECTION: {
            let { text } = message.payload;

            text = text.trimStart().trimEnd();

            text && scIndexedDB.delete(DB_STORE_COLLECTION, text);

            return false;
        }
        default: return;
    }
});