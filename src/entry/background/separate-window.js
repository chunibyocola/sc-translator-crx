/* global chrome */

import { SCTS_CALL_OUT_COMMAND_KEY_PRESSED } from "../../constants/chromeSendMessageTypes";
import { sendMessageToTab } from "../../public/chrome-call";
import { getQueryString } from "../../public/translate/utils";
import { getIsContentScriptEnabled } from "../../public/utils";

let tabId = null;
let windowId = null;

const swUrl = chrome.runtime.getURL('/separate.html');

export const createSeparateWindow = async (text) => {
    const enabled = await getIsContentScriptEnabled(tabId);

    if (enabled) {
        chrome.windows.update(windowId, { focused: true });
        sendMessageToTab(tabId, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED });
    }
    else {
        let query = '';
        text && (query = getQueryString({ text }));
        chrome.windows.create({ url: swUrl + query, type: 'popup', width: 286, height: 439 }, ({ tabs }) => {
            tabId = tabs?.[0]?.id;
            windowId = tabs?.[0]?.windowId;
        });
    }

    return enabled;
};

export const sendTextToSeparateWindow = async (request) => {
    const enabled = await createSeparateWindow(request?.payload?.text);

    enabled && sendMessageToTab(tabId, request);
};