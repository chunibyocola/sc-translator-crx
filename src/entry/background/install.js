import {LANG_ZH_CN, LANG_JA} from '../../constants/langCode';
import {GOOGLE_CN} from '../../constants/translateSource';
import defaultOptions from '../../constants/defaultOptions';
import {initContextMenus} from './context-menus';
import {getLocalStorage} from '../../public/chrome-call';

/* global chrome */

const initStorageOnInstalled = (userLang) => {

    const defaultSet = {...defaultOptions};

    switch (userLang) {
        case LANG_ZH_CN:
            defaultSet.defaultTranslateSource = GOOGLE_CN;
            defaultSet.userLanguage = LANG_ZH_CN;
            break;
        case LANG_JA:
            defaultSet.userLanguage = LANG_JA;
            break;
        default: break;
    }

    getLocalStorage(Object.keys(defaultOptions), (data) => {
        chrome.storage.local.set({...defaultSet, ...data});
    });
};

chrome.runtime.onInstalled.addListener(() => {
    const userLang = navigator.language;

    initStorageOnInstalled(userLang);

    initContextMenus(userLang);
});