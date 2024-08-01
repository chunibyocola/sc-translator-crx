import scOptions from '../../public/sc-options';
import { SyncOptions } from '../../types';

let settingsSyncId = '';

export const syncSettingsToOtherBrowsers = async () => {
    const { sourceParamsCache, ...options } = await scOptions.get(null);

    const settings: SyncOptions = options;
    settingsSyncId = Math.random().toString().substring(2);

    chrome.storage.sync.set({ settings, settingsSyncId });
};

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
        if ('settings' in changes && 'settingsSyncId' in changes && changes.settingsSyncId.newValue !== settingsSyncId) {
            scOptions.get(null).then((options) => {
                chrome.storage.local.set({ ...options, ...changes.settings.newValue });
            });
        }
    }
});