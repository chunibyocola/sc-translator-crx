import { SCTS_SHOULD_AUTO_TRANSLATE_THIS_PAGE, SCTS_UPDATE_PAGE_TRANSLATION_STATE } from '../../constants/chromeSendMessageTypes';
import { setLocalStorage } from '../../public/chrome-call';
import { ChromeRuntimeMessage } from '../../public/send';
import { getLocalStorageAsync } from '../../public/utils';

const pageTranslatingTabMap = new Map<number, string>();

const onBeforeNavigate: (details: chrome.webNavigation.WebNavigationParentedCallbackDetails) => void = ({ url, tabId, frameId }) => {
    if (frameId !== 0) {
        return;
    }

    if (pageTranslatingTabMap.has(tabId) && new URL(url).host !== pageTranslatingTabMap.get(tabId)) {
        pageTranslatingTabMap.delete(tabId);
    }
};

const onCreatedNavigationTarget: (details: chrome.webNavigation.WebNavigationSourceCallbackDetails) => void = ({ url, tabId, sourceTabId, sourceFrameId }) => {
    if (sourceFrameId !== 0) {
        return;
    }

    const host = new URL(url).host;

    if (pageTranslatingTabMap.has(sourceTabId) && host === pageTranslatingTabMap.get(sourceTabId)) {
        pageTranslatingTabMap.set(tabId, host);
    }
};

const tabsOnRemoved: (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => void = (tabId) => {
    if (pageTranslatingTabMap.has(tabId)) {
        pageTranslatingTabMap.delete(tabId);
    }
};

type RuntimeOnMessageCallback = (message: ChromeRuntimeMessage, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => void;
const runtimeOnMessage: RuntimeOnMessageCallback = ({ type, payload }, sender, sendResponse) => {
    const tabId = sender.tab?.id;
    
    if (!tabId) {
        return;
    }

    if (tabId <= 0) {
        return;
    }

    if (type === SCTS_UPDATE_PAGE_TRANSLATION_STATE) {
        if (payload.translating) {
            pageTranslatingTabMap.set(tabId, payload.host);
        }
        else {
            pageTranslatingTabMap.delete(tabId);
        }
    }

    if (type === SCTS_SHOULD_AUTO_TRANSLATE_THIS_PAGE) {
        if (pageTranslatingTabMap.has(tabId) && payload.host === pageTranslatingTabMap.get(tabId)) {
            sendResponse('Yes');
        }
        else {
            sendResponse('No');
        }
    }
};

const startTranslatingRedirectedSameDomainPage = async () => {
    chrome.webNavigation?.onBeforeNavigate.addListener(onBeforeNavigate);
    chrome.webNavigation?.onCreatedNavigationTarget.addListener(onCreatedNavigationTarget);
    chrome.tabs.onRemoved.addListener(tabsOnRemoved);
    chrome.runtime.onMessage.addListener(runtimeOnMessage);

    const { translateRedirectedSameDomainPage } = await getLocalStorageAsync(['translateRedirectedSameDomainPage']);

    if (translateRedirectedSameDomainPage) {
        chrome.permissions.contains({ permissions: ['webNavigation'] }, (result) => {
            if (!result) {
                setLocalStorage({ translateRedirectedSameDomainPage: false });
            }
        });
    }
    else {
        stopTranslatingRedirectedSameDomainPage();
    }
};

const stopTranslatingRedirectedSameDomainPage = () => {
    chrome.webNavigation?.onBeforeNavigate.removeListener(onBeforeNavigate);
    chrome.webNavigation?.onCreatedNavigationTarget.removeListener(onCreatedNavigationTarget);
    chrome.tabs.onRemoved.removeListener(tabsOnRemoved);
    chrome.runtime.onMessage.removeListener(runtimeOnMessage);

    pageTranslatingTabMap.clear();
};

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local') { return; }

    if ('translateRedirectedSameDomainPage' in changes) {
        changes.translateRedirectedSameDomainPage ? startTranslatingRedirectedSameDomainPage() : stopTranslatingRedirectedSameDomainPage();
    }
});

startTranslatingRedirectedSameDomainPage();