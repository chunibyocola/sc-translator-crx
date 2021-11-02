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

export const onExtensionMessage = (cb: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void) => {
    chrome.runtime.onMessage.addListener(cb);
};

export const onStorageChanged = (cb: (changes: { [key: string]: chrome.storage.StorageChange; }, areaName: "sync" | "local" | "managed") => void) => {
    chrome.storage.onChanged.addListener(cb);
};

export const queryTabs = (queryInfo: chrome.tabs.QueryInfo, cb: (result: chrome.tabs.Tab[]) => void) => {
    chrome.tabs.query(queryInfo, cb);
};

export const sendMessageToTab = (tabId: number, msg: any, cb?: ((response: any) => void)) => {
    chrome.tabs.sendMessage(tabId, msg, cb);
};

export const getI18nMessage = (messageName: string) => {
    return chrome.i18n.getMessage(messageName);
};

export const getAllCommands = (cb: (commands: chrome.commands.Command[]) => void) => {
    chrome.commands.getAll(cb);
};

export const createNewTab = (url: string) => {
    chrome.tabs.create({ url });
};

export const getExtensionURL = (path: string) => {
    return chrome.runtime.getURL(path);
};