import { getLocalStorage } from '../../public/chrome-call';
import { listenOptionsChange } from '../../public/options';

const viewerURL = chrome.runtime.getURL('/pdf-viewer/web/viewer.html');

const getRedirectBlocking = (url) => ({
    redirectUrl: `${viewerURL}?file=${encodeURIComponent(url)}`
});

const onBeforeRequest = ({ url }) => {
    return getRedirectBlocking(url);
};

const onHeadersReceived = ({ responseHeaders, url, method }) => {
    if (method.toLowerCase() !== 'get') { return; }

    const contentType = responseHeaders.find(({ name }) => (name.toLowerCase() === 'content-type'));

    if (!contentType) { return; }

    const value = contentType.value.toLowerCase();
    if (value.includes('application/pdf') || (value.includes('application/octet-stream') && url.toLowerCase().endsWith('.pdf'))) {
        return getRedirectBlocking(url);
    }
};

const enablePdfUrlRedirect = () => {
    chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
        urls: ['ftp://*/*.pdf', 'ftp://*/*.PDF', 'file://*/*.pdf', 'file://*/*.PDF'],
        types: ['main_frame', 'sub_frame']
    }, ['blocking']);
    chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, {
        urls: ['https://*/*', 'http://*/*'],
        types: ['main_frame', 'sub_frame']
    }, ['blocking', 'responseHeaders']);
};

const disablePdfUrlRedirect = () => {
    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
    chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived);
};

getLocalStorage('enablePdfViewer', options => options?.enablePdfViewer ? enablePdfUrlRedirect() : disablePdfUrlRedirect());
listenOptionsChange(['enablePdfViewer'], changes => changes?.enablePdfViewer ? enablePdfUrlRedirect() : disablePdfUrlRedirect());