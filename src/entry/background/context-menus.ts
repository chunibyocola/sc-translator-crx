import { SCTS_AUDIO_COMMAND_KEY_PRESSED, SCTS_CONTEXT_MENUS_CLICKED, SCTS_TRANSLATE_CURRENT_PAGE } from '../../constants/chromeSendMessageTypes';
import { createSeparateWindow } from './separate-window';
import { getIsContentScriptEnabled, getLocalStorageAsync } from '../../public/utils';
import {
    contextMenusContexts,
    LISTEN_SELECTION_TEXT,
    OPEN_SEPARATE_WINDOW,
    OPEN_THIS_PAGE_WITH_PDF_VIEWER,
    TRANSLATE_CURRENT_PAGE,
    TRANSLATE_SELECTION_TEXT
} from '../../constants/contextMenusIds';
import { DefaultOptions, OptionsContextMenu } from '../../types';

// Google dosen't provide "chrome.i18n.getMessage" in service worker.
type I18nLocaleCode = 'en' | 'ja' | 'zh_CN' | 'zh_TW';
type I18nMessageKey =
    | 'contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER'
    | 'contextMenus_OPEN_SEPARATE_WINDOW'
    | 'contextMenus_TRANSLATE_SELECTION_TEXT'
    | 'contextMenus_LISTEN_SELECTION_TEXT'
    | 'contextMenus_TRANSLATE_CURRENT_PAGE'
    | 'contextMenus_OPEN_COLLECTION_PAGE';
const i18nMessage: { [P in I18nLocaleCode]: { [K in I18nMessageKey]: string; } } = {
    'en': {
        contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER: 'Open this page with PDF viewer',
        contextMenus_OPEN_SEPARATE_WINDOW: 'Open separate translate window',
        contextMenus_TRANSLATE_SELECTION_TEXT: 'Translate the text you select',
        contextMenus_LISTEN_SELECTION_TEXT: 'Listen the text you select',
        contextMenus_TRANSLATE_CURRENT_PAGE: 'Translate the current page',
        contextMenus_OPEN_COLLECTION_PAGE: 'Open collection page'
    },
    'ja': {
        contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER: 'PDFビューアでこのページを開く',
        contextMenus_OPEN_SEPARATE_WINDOW: 'スタンドアロン翻訳ウィンドウを開く',
        contextMenus_TRANSLATE_SELECTION_TEXT: '選択したテキストを翻訳する',
        contextMenus_LISTEN_SELECTION_TEXT: '選択したテキストの音声を聞く',
        contextMenus_TRANSLATE_CURRENT_PAGE: '現在のページを翻訳する',
        contextMenus_OPEN_COLLECTION_PAGE: 'コレクションページを開く'
    },
    'zh_CN': {
        contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER: '用 PDF 阅读器打开此页面',
        contextMenus_OPEN_SEPARATE_WINDOW: '打开独立翻译窗口',
        contextMenus_TRANSLATE_SELECTION_TEXT: '翻译您选择的文本',
        contextMenus_LISTEN_SELECTION_TEXT: '朗读您选择的文本',
        contextMenus_TRANSLATE_CURRENT_PAGE: '翻译当前页面',
        contextMenus_OPEN_COLLECTION_PAGE: '打开收藏页面'
    },
    'zh_TW': {
        contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER: '用 PDF 閱讀器打開此頁面',
        contextMenus_OPEN_SEPARATE_WINDOW: '打開獨立翻譯視窗',
        contextMenus_TRANSLATE_SELECTION_TEXT: '翻譯您選擇的文字',
        contextMenus_LISTEN_SELECTION_TEXT: '讀讀您選擇的文字',
        contextMenus_TRANSLATE_CURRENT_PAGE: '翻譯當前頁面',
        contextMenus_OPEN_COLLECTION_PAGE: '打開收藏頁面'
    }
};
const getI18nMessage = (message: I18nMessageKey) => {
    const language = navigator.language;
    let localeCode: I18nLocaleCode = 'en';

    if (language === 'ja') {
        localeCode = 'ja';
    }
    else if (language === 'zh-HK' || language === 'zh-TW') {
        localeCode = 'zh_TW'
    }
    else if (language.includes('zh')) {
        localeCode = 'zh_CN';
    }

    return i18nMessage[localeCode][message];
};

type OnContextMenuClick = (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab | undefined) => void;

const translateSelectionText: OnContextMenuClick = async ({ selectionText }, tab) => {
    if (!selectionText) { return; }

    if (tab?.id !== undefined && tab.id >= 0) {
        const enabled = await getIsContentScriptEnabled(tab.id);

        if (enabled) {
            chrome.tabs.sendMessage(tab.id, { type: SCTS_CONTEXT_MENUS_CLICKED, payload: { selectionText } });
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
        enabled && chrome.tabs.sendMessage(tab.id, { type: SCTS_AUDIO_COMMAND_KEY_PRESSED });
    }
};

const openThisPageWithPdfViewer: OnContextMenuClick = (info, tab) => {
    tab?.url && chrome.tabs.create({ url: `${chrome.runtime.getURL('/pdf-viewer/web/viewer.html')}?file=${encodeURIComponent(tab.url)}` });
};

const openSeparateTranslateWindow = () => {
    createSeparateWindow();
};

const translateCurrentPage: OnContextMenuClick = (info, tab) => {
    tab?.id !== undefined && tab.id >= 0 && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_CURRENT_PAGE });
};

const openCollectionPage = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('/collection.html') });
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
                    title: getI18nMessage(`contextMenus_${contextMenu.id}`),
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
            title: getI18nMessage('contextMenus_OPEN_SEPARATE_WINDOW'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        // open this page with pdf viewer
        chrome.contextMenus.create({
            id: 'action_open_this_page_with_pdf_viewer',
            title: getI18nMessage('contextMenus_OPEN_THIS_PAGE_WITH_PDF_VIEWER'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        // open collection page
        chrome.contextMenus.create({
            id: 'action_open_collection_page',
            title: getI18nMessage('contextMenus_OPEN_COLLECTION_PAGE'),
            contexts: ['action']
        }, () => { if (chrome.runtime.lastError) {} });

        getLocalStorageAsync<Pick<DefaultOptions, 'contextMenus'>>(['contextMenus']).then(options => updateContextMenus(options.contextMenus));
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