import { getIsContentScriptEnabled, getIsEnabled, getCurrentTabHost } from '../../public/utils';
import { listenOptionsChange } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';

let isTranslateEnabled = false;
let isContentScriptEnabled = false;
let blackMode = true;
let hostList = [];

const onTabsUpdated = async (tabId, changeInfo, tab) => {
    if (!tab.active) { return; }

    getCurrentTabHost().then((tabHost) => {
        if (!tabHost) return;

        isContentScriptEnabled = !!tabHost;

        updateBadge(tabHost);
    });
};

const onTabsActivated = async ({ tabId }) => {
    isContentScriptEnabled = await getIsContentScriptEnabled(tabId);

    updateBadge();
};

const updateIsTranslateEnabled = async (host = '') => {
    return new Promise((resolve, reject) => {
        if (host) {
            resolve(getIsEnabled(host, hostList, blackMode));
        }
        else {
            getCurrentTabHost().then((tabHost) => {
                if (!tabHost) {
                    reject(false);
                    return;
                }

                resolve(getIsEnabled(tabHost, hostList, blackMode));
            });
        }
    }).catch(() => false);
}

const updateBadge = async (host) => {
    isTranslateEnabled = await updateIsTranslateEnabled(host);

    const grayText = isContentScriptEnabled && isTranslateEnabled ? '' : '-gray';
    chrome.browserAction.setIcon({
        path: {
            16: `image/icon${grayText}-16.png`,
            48: `image/icon${grayText}-48.png`,
            128: `image/icon${grayText}-128.png`
        }
    });
};

getLocalStorage(['translateBlackListMode', 'translateHostList'], (data) => {
    'translateBlackListMode' in data && (blackMode = data.translateBlackListMode);
    'translateHostList' in data && (hostList = data.translateHostList);

    updateBadge();
});

listenOptionsChange(['translateBlackListMode', 'translateHostList'], (changes) => {
    'translateBlackListMode' in changes && (blackMode = changes.translateBlackListMode);
    'translateHostList' in changes && (hostList = changes.translateHostList);

    updateBadge();
});

chrome.tabs.onUpdated.addListener(onTabsUpdated);
chrome.tabs.onActivated.addListener(onTabsActivated);