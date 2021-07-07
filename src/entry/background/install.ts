import { LANG_ZH_CN, LANG_JA, preferredLangCode } from '../../constants/langCode';
import defaultOptions from '../../constants/defaultOptions';
import { getLocalStorage } from '../../public/chrome-call';
import { defaultStyleVars } from '../../constants/defaultStyleVars';
import { TRANSLATE_SELECTION_TEXT } from '../../constants/contextMenusIds';
import { DefaultOptions } from '../../types';

const initStorageOnInstalled = (userLang: string, update: boolean) => {

    const defaultSet = { ...defaultOptions };

    switch (userLang) {
        case LANG_ZH_CN:
            defaultSet.userLanguage = LANG_ZH_CN;
            defaultSet.useDotCn = true;
            break;
        case LANG_JA:
            defaultSet.userLanguage = LANG_JA;
            break;
        default:
            userLang.includes('zh') && (defaultSet.userLanguage = LANG_ZH_CN);
            break;
    }

    preferredLangCode[LANG_ZH_CN].some((v) => (v.code === userLang)) && (defaultSet.preferredLanguage = userLang);
    defaultSet.preferredLanguage === 'en' && (defaultSet.secondPreferredLanguage = 'es');

    getLocalStorage<DefaultOptions & { [key: string]: any }>(Object.keys(defaultOptions), (data) => {
        // in new version, use 'useDotCn' instead of 'xxx.cn'
        if (update && (data.defaultTranslateSource === 'google.cn' || data.defaultTranslateSource === 'bing.cn' || data.defaultAudioSource === 'google.cn')) {
            data.useDotCn = true;
            data.defaultTranslateSource = sourceSwitch(data.defaultTranslateSource);
            data.defaultAudioSource = sourceSwitch(data.defaultAudioSource);
        }

        // In 3.3.0, remake context menus
        if (update && 'enableContextMenus' in data && !('contextMenus' in data)) {
            const index = defaultSet.contextMenus.findIndex(v => v.id === TRANSLATE_SELECTION_TEXT);
            if (index >= 0) {
                defaultSet.contextMenus[index].enabled = data.enableContextMenus as boolean;
            }
        }

        if (data.styleVarsList?.[0]?.styleVars) {
            (data.styleVarsList[0].styleVars = defaultStyleVars);
        }

        chrome.storage.local.set({ ...defaultSet, ...data });
    });
};

const sourceSwitch = (source: string) => {
    switch (source) {
        case 'google.cn': return 'google.com';
        case 'bing.cn': return 'bing.com';
        default: return source;
    }
};

chrome.runtime.onInstalled.addListener((details) => {
    const userLang = navigator.language;

    initStorageOnInstalled(userLang, details.reason === 'update');
});