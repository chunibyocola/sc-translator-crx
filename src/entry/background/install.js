import { LANG_ZH_CN, LANG_JA, preferredLangCode } from '../../constants/langCode';
import defaultOptions from '../../constants/defaultOptions';
import { getLocalStorage } from '../../public/chrome-call';
import { defaultStyleVars } from '../../constants/defaultStyleVars';

const initStorageOnInstalled = (userLang, update) => {

    const defaultSet = { ...defaultOptions };

    switch (userLang) {
        case LANG_ZH_CN:
            defaultSet.userLanguage = LANG_ZH_CN;
            defaultSet.useDotCn = true;
            break;
        case LANG_JA:
            defaultSet.userLanguage = LANG_JA;
            break;
        default: break;
    }

    preferredLangCode[LANG_ZH_CN].some((v) => (v.code === userLang)) && (defaultSet.preferredLanguage = userLang);

    getLocalStorage(Object.keys(defaultOptions), (data) => {
        // in new version, use 'useDotCn' instead of 'xxx.cn'
        if (update && (data.defaultTranslateSource === 'google.cn' || data.defaultTranslateSource === 'bing.cn' || data.defaultAudioSource === 'google.cn')) {
            data.useDotCn = true;
            data.defaultTranslateSource = sourceSwitch(data.defaultTranslateSource);
            data.defaultAudioSource = sourceSwitch(data.defaultAudioSource);
        }

        if (data.styleVarsList?.[0]?.styleVars) {
            (data.styleVarsList[0].styleVars = defaultStyleVars);
        }

        chrome.storage.local.set({ ...defaultSet, ...data });
    });
};

const sourceSwitch = (source) => {
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