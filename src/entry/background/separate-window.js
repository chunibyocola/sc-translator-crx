import { SCTS_CALL_OUT_COMMAND_KEY_PRESSED, SCTS_SEPARATE_WINDOW_SET_TEXT } from "../../constants/chromeSendMessageTypes";
import { getLocalStorage, sendMessageToTab } from "../../public/chrome-call";
import { listenOptionsChange } from "../../public/options";
import { getQueryString } from "../../public/translate/utils";
import { getIsContentScriptEnabled } from "../../public/utils";

const initSize = { width: 286, height: 439, left: 550, top: 250 };
let rememberStwSizeAndPosition = false;
let stwSizeAndPosition = { ...initSize };

let tabId = null;
let windowId = null;

const swUrl = chrome.runtime.getURL('/separate.html');

export const createSeparateWindow = async (text) => {
    const enabled = await getIsContentScriptEnabled(tabId);

    if (enabled) {
        chrome.windows.update(windowId, { focused: true });

        sendMessageToTab(tabId, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED });

        text && sendMessageToTab(tabId, { type: SCTS_SEPARATE_WINDOW_SET_TEXT, payload: { text } });
    }
    else {
        let query = '';
        text && (query = getQueryString({ text }));

        const createData = {
            url: swUrl + query,
            type: 'popup',
            ...(rememberStwSizeAndPosition ? stwSizeAndPosition : initSize)
        };

        chrome.windows.create(createData, ({ tabs }) => {
            tabId = tabs?.[0]?.id;
            windowId = tabs?.[0]?.windowId;
        });
    }

    return enabled;
};

getLocalStorage(['rememberStwSizeAndPosition', 'stwSizeAndPosition'], (storage) => {
    rememberStwSizeAndPosition = storage.rememberStwSizeAndPosition;
    stwSizeAndPosition = storage.stwSizeAndPosition;
});
listenOptionsChange(['rememberStwSizeAndPosition', 'stwSizeAndPosition'], (changes) => {
    'rememberStwSizeAndPosition' in changes && (rememberStwSizeAndPosition = changes.rememberStwSizeAndPosition);
    'stwSizeAndPosition' in changes && (stwSizeAndPosition = changes.stwSizeAndPosition);
});