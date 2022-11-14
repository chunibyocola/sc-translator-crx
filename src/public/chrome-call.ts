import { DefaultOptions } from "../types";

export const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
};

export const getLocalStorage = <T = any>(keys: string | Object | string[] | null, cb?: (data: T) => void) => {
    chrome.storage.local.get(keys, (data) => { cb && cb(data as T); });
};

export const setLocalStorage = (changes: Partial<DefaultOptions>) => {
    chrome.storage.local.set(changes);
};

export const queryTabs = (queryInfo: chrome.tabs.QueryInfo, cb: (result: chrome.tabs.Tab[]) => void) => {
    chrome.tabs.query(queryInfo, cb);
};

export const createNewTab = (url: string) => {
    chrome.tabs.create({ url });
};

export const getExtensionURL = (path: string) => {
    return chrome.runtime.getURL(path);
};