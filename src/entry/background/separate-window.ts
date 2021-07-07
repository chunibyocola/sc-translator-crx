import { SCTS_CALL_OUT_COMMAND_KEY_PRESSED, SCTS_SEPARATE_WINDOW_SET_TEXT } from "../../constants/chromeSendMessageTypes";
import { getLocalStorage, sendMessageToTab } from "../../public/chrome-call";
import { listenOptionsChange } from "../../public/options";
import { getQueryString } from "../../public/translate/utils";
import { getIsContentScriptEnabled } from "../../public/utils";
import { DefaultOptions } from "../../types";

const initSize = { width: 286, height: 439, left: 550, top: 250 };
let rememberStwSizeAndPosition = false;
let stwSizeAndPosition = { ...initSize };

let tabId: number | null = null;
let windowId: number | null = null;

const swUrl = chrome.runtime.getURL('/separate.html');

export const createSeparateWindow = async (text?: string) => {
    const enabled = !!tabId && await getIsContentScriptEnabled(tabId)

    if (enabled && windowId && tabId) {
        chrome.windows.update(windowId, { focused: true });

        sendMessageToTab(tabId, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED });

        text && sendMessageToTab(tabId, { type: SCTS_SEPARATE_WINDOW_SET_TEXT, payload: { text } });
    }
    else {
        let query = '';
        text && (query = getQueryString({ text }));

        const createData: chrome.windows.CreateData = {
            url: swUrl + query,
            type: 'popup',
            ...(rememberStwSizeAndPosition ? stwSizeAndPosition : initSize)
        };

        chrome.windows.create(createData, (window) => {
            if (!window?.tabs) { return; }

            tabId = window.tabs[0]?.id ?? null;
            windowId = window.tabs[0]?.windowId;
        });
    }

    return enabled;
};

type PickedOptions = Pick<DefaultOptions, 'rememberStwSizeAndPosition' | 'stwSizeAndPosition'>;
const keys: (keyof PickedOptions)[] = ['rememberStwSizeAndPosition', 'stwSizeAndPosition'];
getLocalStorage<PickedOptions>(keys, (storage) => {
    rememberStwSizeAndPosition = storage.rememberStwSizeAndPosition;
    stwSizeAndPosition = storage.stwSizeAndPosition;
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.rememberStwSizeAndPosition !== undefined && (rememberStwSizeAndPosition = changes.rememberStwSizeAndPosition);
    changes.stwSizeAndPosition !== undefined && (stwSizeAndPosition = changes.stwSizeAndPosition);
});