import scOptions from "../../public/sc-options";
import { sendTabsCallOutCommandKeyPressed, sendTabsOpenSeparateWindowCommandKeyPressed, sendTabsSeparateWindowSetText } from "../../public/send";
import { getQueryString } from "../../public/translate/utils";

const initSize = { width: 286, height: 439, left: 550, top: 250 };

const swUrl = chrome.runtime.getURL('/separate.html');

const isSeparateWindowCreated = async (): Promise<null | { tabId: number, windowId: number }> => {
    return await new Promise((resolve) => {
        chrome.runtime.sendMessage('Are you separate window?', (data: { tabId: number, windowId: number }) => {
            chrome.runtime.lastError && resolve(null);

            resolve(data);
        });
    });
};

export const createSeparateWindow = async (text?: string) => {
    const separateWindowInfo = await isSeparateWindowCreated();

    if (separateWindowInfo) {
        const { tabId, windowId } = separateWindowInfo;

        chrome.windows.update(windowId, { focused: true });

        if (text) {
            sendTabsCallOutCommandKeyPressed(tabId);
            sendTabsSeparateWindowSetText(tabId, text);
        }
        else {
            sendTabsOpenSeparateWindowCommandKeyPressed(tabId);
        }
    }
    else {
        const { rememberStwSizeAndPosition, stwSizeAndPosition } = await scOptions.get(['rememberStwSizeAndPosition', 'stwSizeAndPosition']);

        const createData: chrome.windows.CreateData = {
            url: swUrl + ((text && getQueryString({ text })) ?? ''),
            type: 'popup',
            ...(rememberStwSizeAndPosition ? stwSizeAndPosition : initSize)
        };

        chrome.windows.create(createData);
    }
};