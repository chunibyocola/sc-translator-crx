import {listenOptionsChange} from '../../public/options';
import {LANG_ZH_CN, LANG_EN, LANG_JA} from '../../constants/langCode';
import {SCTS_CONTEXT_MENUS_CLICKED} from '../../constants/chromeSendMessageTypes';
import {translateText} from '../../constants/localization';

/* global chrome */

let contextMenusCreated = false;

export const initContextMenus = (userLang) => {
    let title;

    switch (userLang) {
        case LANG_ZH_CN: title = translateText[LANG_ZH_CN]; break;
        case LANG_JA: title = translateText[LANG_JA]; break;
        default: title = translateText[LANG_EN]; break;
    }

    chrome.contextMenus.create({
        id: 'sc-translator-context-menu',
        title: `${title} "%s"`,
        contexts: ['selection']
    });

    contextMenusCreated = true;
};

const createContextMenus = () => {
    if (contextMenusCreated) return;

    chrome.storage.local.get(['userLanguage'], (data) => {
        let title;

        if (!data.userLanguage) title = translateText[LANG_EN];
        else title = translateText[data.userLanguage];

        chrome.contextMenus.create({
            id: 'sc-translator-context-menu',
            title: `${title} "%s"`,
            contexts: ['selection']
        });
    });

    contextMenusCreated = true;
};

const removeContextMenus = () => {
    chrome.contextMenus.removeAll();

    contextMenusCreated = false;
};

const onEnableContextMenusChange = (changes) => {
    if (changes.enableContextMenus) createContextMenus();
    else removeContextMenus();
};

const updateContextMenus = (changes) => {
    if (!changes.userLanguage || !contextMenusCreated) return;

    chrome.contextMenus.update('sc-translator-context-menu',{
        title: `${translateText[changes.userLanguage]} "%s"`
    });
};

listenOptionsChange(['enableContextMenus'], onEnableContextMenusChange);
listenOptionsChange(['userLanguage'], updateContextMenus);

chrome.contextMenus.onClicked.addListener(({selectionText}, tab) => {
    if (!tab) return;

    chrome.tabs.sendMessage(
        tab.id,
        {type: SCTS_CONTEXT_MENUS_CLICKED, payload: {selectionText}}
    );
});