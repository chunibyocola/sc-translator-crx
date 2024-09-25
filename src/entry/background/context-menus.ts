import { createSeparateWindow } from './separate-window';
import { getIsContentScriptEnabled, openCollectionPage } from '../../public/utils';
import {
    contextMenusContexts,
    LISTEN_SELECTION_TEXT,
    OPEN_SEPARATE_WINDOW,
    OPEN_THIS_PAGE_WITH_PDF_VIEWER,
    TRANSLATE_CURRENT_PAGE,
    TRANSLATE_SELECTION_TEXT
} from '../../constants/contextMenusIds';
import { OptionsContextMenu } from '../../types';
import { sendTabsAudioCommandKeyPressed, sendTabsContextMenusClicked, sendTabsTranslateCurrentPage } from '../../public/send';
import scOptions from '../../public/sc-options';
import { getMessage } from '../../public/i18n';

type OnContextMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => void;

const translateSelectionText: OnContextMenuClick = async ({ selectionText }, tab) => {
    if (!selectionText) { return; }

    if (tab?.id !== undefined && tab.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);

        if (enabled) {
            sendTabsContextMenusClicked(tab.id, selectionText);
        }
        else {
            createSeparateWindow(selectionText);
        }
    }
    else {
        createSeparateWindow(selectionText);
    }
};

const listenSelectionText: OnContextMenuClick = async ({ selectionText }, tab) => {
    if (!selectionText) { return; }

    if (tab?.id !== undefined && tab.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);
        enabled && sendTabsAudioCommandKeyPressed(tab.id);
    }
};

const openThisPageWithPdfViewer: OnContextMenuClick = (info, tab) => {
    tab?.url && chrome.tabs.create({ url: `${chrome.runtime.getURL('/pdf-viewer/web/viewer.html')}?file=${encodeURIComponent(tab.url)}` });
};

const openSeparateTranslateWindow = () => {
    createSeparateWindow();
};

const translateCurrentPage: OnContextMenuClick = (info, tab) => {
    tab?.id !== undefined && tab.id >= 0 && sendTabsTranslateCurrentPage(tab.id);
};

const updateContextMenus = (contextMenus: OptionsContextMenu[]) => {
    // To fix the issue of context menus disappear after opening incognito page.
    // Replace chrome.contextMenus.removeAll() with the below codes.
    // Also, there is a better way, using contextMenus' visible.
    // But I don't want the wrapper even there is only a single context menu.
    // Will be switch to "contextMenus' visible" if the below way cause bugs.
    contextMenus.forEach((contextMenu) => {
        chrome.contextMenus.remove(contextMenu.id, () => {
            // Catch the "Cannot find menu item with id" error, and ignore it.
            if (chrome.runtime.lastError) {}

            if (contextMenu.enabled) {
                chrome.contextMenus.create({
                    id: contextMenu.id,
                    title: getMessage(`contextMenus_${contextMenu.id}`),
                    contexts: contextMenusContexts[contextMenu.id]
                }, () => {
                    // Catch the "Cannot create item with duplicate id" error, and ignore it.
                    if (chrome.runtime.lastError) {}
                });
            }
        });
    });
};

export const initContextMenus = () => {
    chrome.contextMenus.removeAll(() => {
        // open separate window
        chrome.contextMenus.create({
            id: 'action_separate_window',
            title: getMessage('contextMenus_OPEN_SEPARATE_WINDOW'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        // open this page with pdf viewer
        chrome.contextMenus.create({
            id: 'action_open_this_page_with_pdf_viewer',
            title: getMessage('contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        // translate current page
        chrome.contextMenus.create({
            id: 'action_translate_current_page',
            title: getMessage('contextMenus_TRANSLATE_CURRENT_PAGE'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        // open collection page
        chrome.contextMenus.create({
            id: 'action_open_collection_page',
            title: getMessage('popupOpenCollectionPage'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        scOptions.get(['contextMenus']).then(options => updateContextMenus(options.contextMenus));
    });
};

chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case TRANSLATE_SELECTION_TEXT:
            translateSelectionText(info, tab);
            return;
        case LISTEN_SELECTION_TEXT:
            listenSelectionText(info, tab);
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
        case 'action_separate_window':
            openSeparateTranslateWindow();
            return;
        case 'action_open_this_page_with_pdf_viewer':
            openThisPageWithPdfViewer(info, tab);
            return;
        case 'action_translate_current_page':
            translateCurrentPage(info, tab);
            return;
        case 'action_open_collection_page':
            openCollectionPage();
            return;
        default: return;
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') { return; }

    if ('contextMenus' in changes) {
        updateContextMenus(changes['contextMenus'].newValue);
    }
});