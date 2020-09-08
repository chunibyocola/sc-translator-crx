/* global chrome */
import { getLocalStorage } from '../../public/chrome-call';
import { listenOptionsChange } from '../../public/options';

let enablePdfViewer = false;

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
    if (value.includes('application/pdf') || (value.includes('application/octet-stream' && url.toLowerCase().endsWith('.pdf')))) {
        return getRedirectBlocking(url);
    }
};

const enablePdfUrlRedirect = () => {
    if (enablePdfViewer) { return; }

    chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
        urls: ['ftp://*/*.pdf', 'ftp://*/*.PDF', 'file://*/*.pdf', 'file://*/*.PDF'],
        types: ['main_frame', 'sub_frame']
    }, ['blocking']);
    chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, {
        urls: ['https://*/*', 'https://*/*', 'http://*/*', 'http://*/*'],
        types: ['main_frame', 'sub_frame']
    }, ['blocking', 'responseHeaders']);

    enablePdfViewer = true;
};

const disablePdfUrlRedirect = () => {
    if (!enablePdfViewer) { return; }

    chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
    chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived);

    enablePdfViewer = false;
};

getLocalStorage('enablePdfViewer', options => 'enablePdfViewer' in options && options.enablePdfViewer ? enablePdfUrlRedirect() : disablePdfUrlRedirect());
listenOptionsChange(['enablePdfViewer'], changes => 'enablePdfViewer' in changes && changes.enablePdfViewer ? enablePdfUrlRedirect() : disablePdfUrlRedirect());