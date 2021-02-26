/* global chrome */
/* export const chromeCallback = (target, methodName, ...args) => {
    return new Promise((resolve, reject) => {
        target[methodName](...args, (...args1) => {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve(args1);
        });
    });
}; */

export const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
};

export const getLocalStorage = (keys, cb) => {
    chrome.storage.local.get(keys, (data) => { cb && cb(data); });
};

export const setLocalStorage = (changes) => {
    chrome.storage.local.set(changes);
};

export const onExtensionMessage = (cb) => {
    chrome.runtime.onMessage.addListener(cb);
};

export const onStorageChanged = (cb) => {
    chrome.storage.onChanged.addListener(cb);
};

export const queryTabs = (queryInfo, cb) => {
    chrome.tabs.query(queryInfo, cb);
};

export const sendMessageToTab = (tabId, msg, cb = undefined) => {
    chrome.tabs.sendMessage(tabId, msg, cb);
};

export const getI18nMessage = (messageName) => {
    return chrome.i18n.getMessage(messageName);
};

export const getAllCommands = (cb) => {
    chrome.commands.getAll(cb);
};

export const createNewTab = (url) => {
    chrome.tabs.create({ url });
};

export const getExtensionURL = (path) => {
    return chrome.runtime.getURL(path);
};