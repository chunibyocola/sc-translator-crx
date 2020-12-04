/* global chrome */

import { SCTS_CALL_OUT_COMMAND_KEY_PRESSED } from "../../constants/chromeSendMessageTypes";
import { sendMessageToTab } from "../../public/chrome-call";
import { getIsContentScriptEnabled } from "../../public/utils";

let tabId = null;
let windowId = null;

const swUrl = chrome.runtime.getURL('/separate.html');

export const createSeparateWindow = async () => {
    const enabled = await getIsContentScriptEnabled(tabId);

    if (enabled) {
        chrome.windows.update(windowId, { focused: true });
        sendMessageToTab(tabId, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED });
    }
    else {
        chrome.windows.create({ url: swUrl, type: 'popup', width: 286, height: 439 }, ({ tabs }) => {
            tabId = tabs?.[0]?.id;
            windowId = tabs?.[0]?.windowId;
        });
    }
};