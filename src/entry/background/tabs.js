/* global chrome */
import {getIsContentScriptEnabled, getIsEnabled, getCurrentTab, getHost} from '../../public/utils';
import {listenOptionsChange} from '../../public/options';
import {getLocalStorage} from '../../public/chrome-call';

let isTranslateEnabled = false;
let isContentScriptEnabled = false;
let blackMode = true;
let hostList = [];

const onTabsUpdated = async (tabId, changeInfo, tab) => {
    if (!tab.active || !tab.url) return;

    isContentScriptEnabled = await getIsContentScriptEnabled(tabId);

    updateBadge(getHost(tab.url));
};

const onTabsActivated = async ({tabId}) => {
    isContentScriptEnabled = await getIsContentScriptEnabled(tabId);

    updateBadge();
};

const updateIsTranslateEnabled = async (host = '') => {
    return new Promise((resolve, reject) => {
        if (host) {
            resolve(getIsEnabled(host, hostList, blackMode));
        }
        else {
            getCurrentTab((tab) => {
                if (!tab.url) reject(false);
                else resolve(getIsEnabled(getHost(tab.url), hostList, blackMode));
            });
        }
    }).catch(() => false);
}

const updateBadge = async (host) => {
    isTranslateEnabled = await updateIsTranslateEnabled(host);

    chrome.browserAction.setBadgeText({
        text: isContentScriptEnabled && isTranslateEnabled? '': 'off'
    });
};

getLocalStorage(['translateBlackListMode', 'translateHostList'], (data) => {
    if (data.translateBlackListMode) blackMode = data.translateBlackListMode;
    if (data.translateHostList) hostList = data.translateHostList;

    updateBadge();
});

listenOptionsChange(['translateBlackListMode', 'translateHostList'], (changes) => {
    changes.translateBlackListMode && (blackMode = changes.translateBlackListMode);
    changes.translateHostList && (hostList = changes.translateHostList);

    updateBadge();
});

chrome.tabs.onUpdated.addListener(onTabsUpdated);
chrome.tabs.onActivated.addListener(onTabsActivated);