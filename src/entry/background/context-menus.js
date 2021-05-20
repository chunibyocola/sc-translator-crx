import { listenOptionsChange } from '../../public/options';
import { SCTS_CONTEXT_MENUS_CLICKED } from '../../constants/chromeSendMessageTypes';
import { createNewTab, getI18nMessage, getLocalStorage } from '../../public/chrome-call';
import { createSeparateWindow } from './separate-window';
import { getIsContentScriptEnabled } from '../../public/utils';
import { contextMenusContexts, LISTEN_SELECTION_TEXT, OPEN_SEPARATE_WINDOW, OPEN_THIS_PAGE_WITH_PDF_VIEWER, TRANSLATE_SELECTION_TEXT } from '../../constants/contextMenusIds';
import { playAudio } from './audio';
import { audio } from '../../public/request';

const translateSelectionText = async ({ selectionText }, tab) => {
    if (tab?.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);
        enabled
            ? chrome.tabs.sendMessage(tab.id, { type: SCTS_CONTEXT_MENUS_CLICKED, payload: { selectionText } })
            : createSeparateWindow(selectionText);
    }
    else {
        createSeparateWindow(selectionText);
    }
};

const listenSelectionText = ({ selectionText }) => {
    getLocalStorage(['defaultAudioSource', 'useDotCn'], (storage) => {
        const defaultAudioSource = storage.defaultAudioSource;
        const useDotCn = storage.useDotCn;
        audio({ defaultSource: defaultAudioSource, requestObj: { text: selectionText, com: !useDotCn } }, uri => playAudio(uri));
    });
};

const openThisPageWithPdfViewer = (info, { url }) => {
    url && createNewTab(`${chrome.runtime.getURL('/pdf-viewer/web/viewer.html')}?file=${encodeURIComponent(url)}`);
};

const openSeparateTranslateWindow = () => {
    createSeparateWindow();
};

const updateContextMenus = (contextMenus) => {
    chrome.contextMenus.removeAll();

    contextMenus.forEach((contextMenu) => {
        contextMenu.enabled && chrome.contextMenus.create({
            id: contextMenu.id,
            title: getI18nMessage(`contextMenus_${contextMenu.id}`),
            contexts: contextMenusContexts[contextMenu.id]
        })
    });

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
};

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
        default: return;
    }
});

listenOptionsChange(['contextMenus'], changes => changes.contextMenus && updateContextMenus(changes.contextMenus));

getLocalStorage('contextMenus', options => options.contextMenus && updateContextMenus(options.contextMenus));