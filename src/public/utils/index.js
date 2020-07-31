import {queryTabs, sendMessageToTab} from '../chrome-call';

export const resultToString = result => result.reduce((t, c) => (t + c), '');

export const getCurrentTab = (cb) => {
    queryTabs({active: true, lastFocusedWindow: true}, tabs => cb(tabs[0]));
};

export const getCurrentTabUrl = (cb) => {
    getCurrentTab(tab => cb(tab.url));
};

export const getCurrentTabHost = (cb) => {
    getCurrentTabUrl((url) => {
        cb(new URL(url).host);
    });
};

export const getHost = (url) => {
    return new URL(url).host;
};

export const getNavigatorLanguage = () => {
    return navigator.language;
};

/* global chrome */
export const getIsContentScriptEnabled = async (tabId) => {
    return await new Promise((resolve, reject) =>{
        sendMessageToTab(tabId, 'Are you enabled?', () => {
            if (chrome.runtime.lastError) reject(false);
            resolve(true);
        });
    }).catch(() => false);
};

export const getIsEnabled = (host, hostList, mode) => {
    const find = hostList.some(v => host.endsWith(v));
    return mode? !find: find;
}