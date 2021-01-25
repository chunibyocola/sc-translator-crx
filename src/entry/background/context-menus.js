import { listenOptionsChange } from '../../public/options';
import { SCTS_CONTEXT_MENUS_CLICKED } from '../../constants/chromeSendMessageTypes';
import { getI18nMessage, getLocalStorage } from '../../public/chrome-call';
import { createSeparateWindow } from './separate-window';

/* global chrome */

let contextMenusCreated = false;

const createContextMenus = () => {
    if (contextMenusCreated) return;

    chrome.contextMenus.create({
        id: 'sc-translator-context-menu',
        title: `${getI18nMessage('wordTranslate')} "%s"`,
        contexts: ['selection'],
        onclick: ({ selectionText }, tab) => {
            tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_CONTEXT_MENUS_CLICKED, payload: { selectionText } });
        }
    });

    contextMenusCreated = true;
};

const removeContextMenus = () => {
    chrome.contextMenus.remove('sc-translator-context-menu');

    contextMenusCreated = false;
};

const onEnableContextMenusChange = (changes) => {
    if (changes.enableContextMenus) createContextMenus();
    else removeContextMenus();
};

listenOptionsChange(['enableContextMenus'], onEnableContextMenusChange);

getLocalStorage('enableContextMenus', options => options.enableContextMenus && createContextMenus());

// open separate window
chrome.contextMenus.create({
    id: 'separate_window',
    title: getI18nMessage('extOpenSeparateWindowDescription'),
    contexts: ['browser_action'],
    onclick: () => {
        createSeparateWindow();
    }
});