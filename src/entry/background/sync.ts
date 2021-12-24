import defaultOptions from '../../constants/defaultOptions';
import { getLocalStorageAsync } from '../../public/utils';
import { DefaultOptions, SyncOptions } from '../../types';

let settingsSyncId = '';

export const syncSettingsToOtherBrowsers = async () => {
    const { sourceParamsCache, ...options } = await getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]);

    const settings: SyncOptions = options;
    settingsSyncId = Math.random().toString().substring(2);

    chrome.storage.sync.set({ settings, settingsSyncId });
};

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
        if ('settings' in changes && 'settingsSyncId' in changes && changes.settingsSyncId.newValue !== settingsSyncId) {
            getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]).then((options) => {
                chrome.storage.local.set({ ...options, ...changes.settings.newValue });
            });
        }
    }
});