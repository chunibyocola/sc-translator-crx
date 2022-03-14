import * as types from '../../constants/chromeSendMessageTypes';
import { translate, audio, detect } from '../../public/request';
import { createSeparateWindow } from './separate-window';
import { DefaultOptions } from '../../types';
import { getLocalStorageAsync } from '../../public/utils';
import { syncSettingsToOtherBrowsers } from './sync';
import scIndexedDB, { DB_STORE_COLLECTION, StoreCollectionValue } from '../../public/sc-indexed-db';
import { ChromeRuntimeMessage } from '../../public/send';

chrome.runtime.onMessage.addListener((message: ChromeRuntimeMessage, sender, sendResponse) => {
    switch (message.type) {
        case types.SCTS_TRANSLATE: {
            type TranslatePickedOptions = Pick<DefaultOptions, 'useDotCn' | 'preferredLanguage' | 'secondPreferredLanguage'>;
            const translatePickedKeys: (keyof TranslatePickedOptions)[] = ['useDotCn', 'preferredLanguage', 'secondPreferredLanguage'];

            getLocalStorageAsync<TranslatePickedOptions>(translatePickedKeys).then((storage) => {
                const com = !storage.useDotCn;
                const preferredLanguage = storage.preferredLanguage;
                const secondPreferredLanguage = storage.secondPreferredLanguage;

                translate({ ...message.payload, com, preferredLanguage, secondPreferredLanguage }, (result) => {
                    sendResponse(result);
                });
            });

            return true;
        }
        case types.SCTS_AUDIO: {
            getLocalStorageAsync<Pick<DefaultOptions, 'useDotCn'>>(['useDotCn']).then((storage) => {
                audio({ ...message.payload, com: !storage.useDotCn }, (result) => {
                    sendResponse(result);
                });
            });

            return true;
        }
        case types.SCTS_DETECT: {
            getLocalStorageAsync<Pick<DefaultOptions, 'useDotCn'>>(['useDotCn']).then((storage) => {
                detect({ ...message.payload, com: !storage.useDotCn }, (result) => {
                    sendResponse(result);
                });
            });

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
                scIndexedDB.get<StoreCollectionValue>(DB_STORE_COLLECTION, text)
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

            text = text.trimLeft().trimRight();

            text && scIndexedDB.add<StoreCollectionValue>(DB_STORE_COLLECTION, { text, date: Number(new Date()), translations });

            return false;
        }
        case types.SCTS_REMOVE_FROM_COLLECTION: {
            let { text } = message.payload;

            text = text.trimLeft().trimRight();

            text && scIndexedDB.delete(DB_STORE_COLLECTION, text);

            return false;
        }
        default: return;
    }
});