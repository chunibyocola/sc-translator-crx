import scOptions from '../../public/sc-options';
import { getIsEnabled, getCurrentTabHost } from '../../public/utils';

const onTabsUpdated: (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => void = async (tabId, changeInfo, tab) => {
    if (!tab.active) { return; }

    updateBadge(tabId);
};

const onTabsActivated: (activeInfo: chrome.tabs.TabActiveInfo) => void = async ({ tabId }) => {
    updateBadge(tabId);
};

const updateBadge = async (tabId?: number) => {
    const tabHost = await getCurrentTabHost(tabId);

    const pickedOptions = !!tabHost && await scOptions.get(['translateBlackListMode', 'translateHostList']);

    const enabled = pickedOptions && getIsEnabled(tabHost, pickedOptions.translateHostList, pickedOptions.translateBlackListMode);

    chrome.action.setIcon({ path: { 128: `/image/icon${enabled ? '' : '-gray'}-128.png` } });
};

chrome.tabs.onUpdated.addListener(onTabsUpdated);
chrome.tabs.onActivated.addListener(onTabsActivated);

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') { return; }

    if ('translateBlackListMode' in changes || 'translateHostList' in changes) {
        updateBadge();
    }
});