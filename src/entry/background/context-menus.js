import {listenOptionsChange} from '../../public/options';
import {SCTS_CONTEXT_MENUS_CLICKED} from '../../constants/chromeSendMessageTypes';
import {getI18nMessage} from '../../public/chrome-call';

/* global chrome */

let contextMenusCreated = false;

export const initContextMenus = (userLang) => {
    chrome.contextMenus.create({
        id: 'sc-translator-context-menu',
        title: `${getI18nMessage('wordTranslate')} "%s"`,
        contexts: ['selection']
    });

    contextMenusCreated = true;
};

const createContextMenus = () => {
    if (contextMenusCreated) return;

    chrome.contextMenus.create({
        id: 'sc-translator-context-menu',
        title: `${getI18nMessage('wordTranslate')} "%s"`,
        contexts: ['selection']
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

listenOptionsChange(['enableContextMenus'], onEnableContextMenusChange);

chrome.contextMenus.onClicked.addListener(({selectionText}, tab) => {
    if (!tab) return;

    chrome.tabs.sendMessage(
        tab.id,
        {type: SCTS_CONTEXT_MENUS_CLICKED, payload: {selectionText}}
    );
});