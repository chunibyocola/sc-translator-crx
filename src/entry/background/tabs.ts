import { getIsContentScriptEnabled, getIsEnabled, getCurrentTabHost } from '../../public/utils';
import { listenOptionsChange } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import { DefaultOptions } from '../../types';

let isTranslateEnabled = false;
let isContentScriptEnabled = false;
let blackMode = true;
let hostList: string[] = [];

const onTabsUpdated: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void = async (tabId, changeInfo, tab) => {
    if (!tab.active) { return; }

    getCurrentTabHost(tabId).then((tabHost) => {
        if (!tabHost) { return; }

        isContentScriptEnabled = !!tabHost;

        updateBadge(tabHost, tabId);
    });
};

const onTabsActivated: (activeInfo: chrome.tabs.TabActiveInfo) => void = async ({ tabId }) => {
    isContentScriptEnabled = await getIsContentScriptEnabled(tabId);

    updateBadge('', tabId);
};

const updateIsTranslateEnabled = async (host = '', tabId?: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            if (host) {
                resolve(getIsEnabled(host, hostList, blackMode));
            }
            else {
                getCurrentTabHost(tabId).then((tabHost) => {
                    if (!tabHost) {
                        resolve(false);
                        return;
                    }

                    resolve(getIsEnabled(tabHost, hostList, blackMode));
                });
            }
        }
        catch {
            resolve(false);
        }
    });
}

const updateBadge = async (host?: string, tabId?: number) => {
    isTranslateEnabled = await updateIsTranslateEnabled(host, tabId);

    const grayText = isContentScriptEnabled && isTranslateEnabled ? '' : '-gray';
    chrome.browserAction.setIcon({
        path: {
            16: `image/icon${grayText}-16.png`,
            48: `image/icon${grayText}-48.png`,
            128: `image/icon${grayText}-128.png`
        }
    });
};

type PickedOptions = Pick<DefaultOptions, 'translateBlackListMode' | 'translateHostList'>;
const keys: (keyof PickedOptions)[] = ['translateBlackListMode', 'translateHostList'];
getLocalStorage<PickedOptions>(keys, (data) => {
    'translateBlackListMode' in data && (blackMode = data.translateBlackListMode);
    'translateHostList' in data && (hostList = data.translateHostList);

    updateBadge();
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.translateBlackListMode !== undefined && (blackMode = changes.translateBlackListMode);
    changes.translateHostList !== undefined && (hostList = changes.translateHostList);

    updateBadge();
});

chrome.tabs.onUpdated.addListener(onTabsUpdated);
chrome.tabs.onActivated.addListener(onTabsActivated);