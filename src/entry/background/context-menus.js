import { listenOptionsChange } from '../../public/options';
import { SCTS_CONTEXT_MENUS_CLICKED } from '../../constants/chromeSendMessageTypes';
import { createNewTab, getI18nMessage, getLocalStorage } from '../../public/chrome-call';
import { createSeparateWindow } from './separate-window';

const createContextMenus = () => {
    chrome.contextMenus.create({
        id: 'sc-translator-context-menu',
        title: `${getI18nMessage('wordTranslate')} "%s"`,
        contexts: ['selection'],
        onclick: ({ selectionText }, tab) => {
            tab?.id >= 0 && chrome.tabs.sendMessage(tab.id, { type: SCTS_CONTEXT_MENUS_CLICKED, payload: { selectionText } });
        }
    });
};

const removeContextMenus = () => {
    chrome.contextMenus.remove('sc-translator-context-menu');
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

// open this page with pdf viewer
chrome.contextMenus.create({
    id: 'open_this_page_with_pdf_viewer',
    title: getI18nMessage('extOpenWithPdfViewerDescription'),
    contexts: ['browser_action'],
    onclick: (info, { url }) => {
        url && createNewTab(`${chrome.runtime.getURL('/pdf-viewer/web/viewer.html')}?file=${encodeURIComponent(url)}`);
    }
});