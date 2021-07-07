import { getLocalStorage } from '../../public/chrome-call';
import { listenOptionsChange } from '../../public/options';
import { DefaultOptions } from '../../types';

const viewerURL = chrome.runtime.getURL('/pdf-viewer/web/viewer.html');

const getRedirectBlocking = (url: string) => ({
    redirectUrl: `${viewerURL}?file=${encodeURIComponent(url)}`
});

const onBeforeRequest: (details: chrome.webRequest.WebRequestBodyDetails) => void = ({ url }) => {
    return getRedirectBlocking(url);
};

const onHeadersReceived: (details: chrome.webRequest.WebResponseHeadersDetails) => void = ({ responseHeaders, url, method }) => {
    if (method.toLowerCase() !== 'get' || !responseHeaders) { return; }

    const contentType = responseHeaders.find(({ name }) => (name.toLowerCase() === 'content-type'));

    if (!contentType?.value) { return; }

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

type PickedOptions = Pick<DefaultOptions, 'enablePdfViewer'>;
const keys: (keyof PickedOptions)[] = ['enablePdfViewer'];
getLocalStorage<PickedOptions>(keys, options => options.enablePdfViewer ? enablePdfUrlRedirect() : disablePdfUrlRedirect());
listenOptionsChange<PickedOptions>(keys, changes => changes.enablePdfViewer !== undefined && (changes.enablePdfViewer ? enablePdfUrlRedirect() : disablePdfUrlRedirect()));