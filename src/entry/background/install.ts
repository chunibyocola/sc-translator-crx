import { LANG_ZH_CN, LANG_JA, preferredLangCode } from '../../constants/langCode';
import defaultOptions from '../../constants/defaultOptions';
import { defaultStyleVars } from '../../constants/defaultStyleVars';
import { TRANSLATE_CURRENT_PAGE, TRANSLATE_SELECTION_TEXT } from '../../constants/contextMenusIds';
import { DefaultOptions, DeprecatedOptions } from '../../types';
import { TRANSLATE_BUTTON_TRANSLATE } from '../../constants/translateButtonTypes';
import { initContextMenus } from './context-menus';
import { initSourceParams } from '../../constants/sourceParams';
import { BAIDU_COM, BING_COM, MICROSOFT_COM } from '../../constants/translateSource';
import scOptions from '../../public/sc-options';

const initStorageOnInstalled = (userLang: string, update: boolean) => {

    const defaultSet = { ...defaultOptions };

    switch (userLang) {
        case LANG_ZH_CN:
            defaultSet.userLanguage = LANG_ZH_CN;
            defaultSet.useDotCn = true;
            defaultSet.multipleTranslateSourceList = [BING_COM, BAIDU_COM];
            defaultSet.defaultAudioSource = BING_COM;
            defaultSet.webPageTranslateSource = MICROSOFT_COM;
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
    defaultSet.webPageTranslateTo = defaultSet.preferredLanguage;
    defaultSet.translateButtonsTL = { first: '', second: defaultSet.preferredLanguage, third: defaultSet.secondPreferredLanguage };

    scOptions.get(null).then((d: any) => {
        const data = d as DefaultOptions & DeprecatedOptions;
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
                defaultSet.contextMenus[index].enabled = (data as DeprecatedOptions).enableContextMenus;
            }
        }

        if (update && 'contextMenus' in data) {
            const index = data.contextMenus.findIndex(v => v.id === TRANSLATE_CURRENT_PAGE);
            if (index === -1) {
                data.contextMenus = data.contextMenus.concat({ id: TRANSLATE_CURRENT_PAGE, enabled: false });
            }
        }

        // In 3.9.0, remake translate button
        if (update && 'showButtonAfterSelect' in data && !('translateButtons' in data)) {
            (data as DefaultOptions).translateButtons = (data as DeprecatedOptions).showButtonAfterSelect ? [TRANSLATE_BUTTON_TRANSLATE] : [];
        }

        if (update && data.displayOfTranslation) {
            data.displayOfTranslation = { ...defaultSet.displayOfTranslation, ...data.displayOfTranslation };
        }

        if (update && data.displayModeEnhancement) {
            data.displayModeEnhancement = { ...defaultSet.displayModeEnhancement, ...data.displayModeEnhancement };
        }

        if (update && data.styleVarsList?.[0]?.styleVars) {
            (data.styleVarsList[0].styleVars = defaultStyleVars);
        }

        // Remove Baidu audio
        if (update && data.defaultAudioSource === 'baidu.com') {
            data.defaultAudioSource = defaultSet.defaultAudioSource;
        }

        chrome.storage.local.set({ ...defaultSet, ...data, sourceParamsCache: initSourceParams }, () => {
            initContextMenus();
        });
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