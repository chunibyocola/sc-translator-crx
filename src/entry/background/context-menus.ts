import { listenOptionsChange } from '../../public/options';
import { SCTS_CONTEXT_MENUS_CLICKED, SCTS_TRANSLATE_CURRENT_PAGE } from '../../constants/chromeSendMessageTypes';
import { createNewTab, getI18nMessage, getLocalStorage } from '../../public/chrome-call';
import { createSeparateWindow } from './separate-window';
import { getIsContentScriptEnabled } from '../../public/utils';
import {
    contextMenusContexts,
    LISTEN_SELECTION_TEXT,
    OPEN_SEPARATE_WINDOW,
    OPEN_THIS_PAGE_WITH_PDF_VIEWER,
    TRANSLATE_CURRENT_PAGE,
    TRANSLATE_SELECTION_TEXT
} from '../../constants/contextMenusIds';
import { playAudio } from './audio';
import { audio } from '../../public/request';
import { DefaultOptions, OptionsContextMenu } from '../../types';

type OnContextMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => void;

const translateSelectionText: OnContextMenuClick = async ({ selectionText }, tab) => {
    if (!selectionText) { return; }

    if (tab?.id && tab.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);
        enabled
            ? chrome.tabs.sendMessage(tab.id, { type: SCTS_CONTEXT_MENUS_CLICKED, payload: { selectionText } })
            : createSeparateWindow(selectionText);
    }
    else {
        createSeparateWindow(selectionText);
    }
};

const listenSelectionText: OnContextMenuClick = ({ selectionText }) => {
    if (!selectionText) { return; }

    type PickedOptions = Pick<DefaultOptions, 'defaultAudioSource' | 'useDotCn'>;
    const tmpKeys: (keyof PickedOptions)[] = ['defaultAudioSource', 'useDotCn'];
    getLocalStorage<PickedOptions>(tmpKeys, (storage) => {
        const defaultAudioSource = storage.defaultAudioSource;
        const useDotCn = storage.useDotCn;
        audio({ source: defaultAudioSource, defaultSource: defaultAudioSource, requestObj: { text: selectionText, com: !useDotCn } }, uri => playAudio(uri));
    });
};

const openThisPageWithPdfViewer: OnContextMenuClick = (info, tab) => {
    tab?.url && createNewTab(`${chrome.runtime.getURL('/pdf-viewer/web/viewer.html')}?file=${encodeURIComponent(tab.url)}`);
};

const openSeparateTranslateWindow = () => {
    createSeparateWindow();
};

const translateCurrentPage: OnContextMenuClick = (info, tab) => {
    tab?.id !== undefined && tab.id >= 0 && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_CURRENT_PAGE });
};

const updateContextMenus = (contextMenus: OptionsContextMenu[]) => {
    // To fix the issue of context menus disappear after opening incognito page.
    // Replace chrome.contextMenus.removeAll() with the below codes.
    // Also, there is a better way, using contextMenus' visible.
    // But I don't want the wrapper even there is only a single context menu.
    // Will be switch to "contextMenus' visible" if the below way cause bugs.
    contextMenus.forEach((contextMenu) => {
        if (contextMenu.enabled) {
            chrome.contextMenus.create({
                id: contextMenu.id,
                title: getI18nMessage(`contextMenus_${contextMenu.id}`),
                contexts: contextMenusContexts[contextMenu.id]
            }, () => {
                // Catch the "Cannot create item with duplicate id" error, and ignore it.
                if (chrome.runtime.lastError) { return; }
            });
        }
        else {
            chrome.contextMenus.remove(contextMenu.id, () => {
                // Catch the "Cannot find menu item with id" error, and ignore it.
                if (chrome.runtime.lastError) { return; }
            });
        }
    });
};

// open separate window
chrome.contextMenus.create({
    id: 'separate_window',
    title: getI18nMessage('extOpenSeparateWindowDescription'),
    contexts: ['browser_action'],
    onclick: openSeparateTranslateWindow
});

// open this page with pdf viewer
chrome.contextMenus.create({
    id: 'open_this_page_with_pdf_viewer',
    title: getI18nMessage('extOpenWithPdfViewerDescription'),
    contexts: ['browser_action'],
    onclick: openThisPageWithPdfViewer
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case TRANSLATE_SELECTION_TEXT:
            translateSelectionText(info, tab);
            return;
        case LISTEN_SELECTION_TEXT:
            listenSelectionText(info);
            return;
        case OPEN_SEPARATE_WINDOW:
            openSeparateTranslateWindow();
            return;
        case OPEN_THIS_PAGE_WITH_PDF_VIEWER:
            openThisPageWithPdfViewer(info, tab);
            return;
        case TRANSLATE_CURRENT_PAGE:
            translateCurrentPage(info, tab);
            return;
        default: return;
    }
});

type PickedOptions = Pick<DefaultOptions, 'contextMenus'>;
const keys: (keyof PickedOptions)[] = ['contextMenus'];
getLocalStorage<PickedOptions>(keys, options => options.contextMenus && updateContextMenus(options.contextMenus));
listenOptionsChange<PickedOptions>(keys, changes => changes.contextMenus !== undefined && updateContextMenus(changes.contextMenus));