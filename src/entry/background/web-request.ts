import { getLocalStorageAsync } from '../../public/utils';
import { DefaultOptions } from '../../types';

type PickedOptions = Pick<DefaultOptions, 'enablePdfViewer'>;
const keys: (keyof PickedOptions)[] = ['enablePdfViewer'];

const viewerURL = chrome.runtime.getURL('/pdf-viewer/web/viewer.html');

const getRedirectURL = (url: string) => (`${viewerURL}?file=${encodeURIComponent(url)}`);

const onBeforeRequest: (details: chrome.webRequest.WebRequestBodyDetails) => void = ({ url, tabId }: chrome.webRequest.WebRequestBodyDetails) => {
    getLocalStorageAsync<PickedOptions>(keys).then(({ enablePdfViewer }) => {
        enablePdfViewer && chrome.tabs.update(tabId, { url: getRedirectURL(url) });
    });
};

const onHeadersReceived: (details: chrome.webRequest.WebResponseHeadersDetails) => void = ({ responseHeaders, url, method, tabId }) => {
    if (method.toLowerCase() !== 'get' || !responseHeaders) { return; }

    const contentType = responseHeaders.find(({ name }) => (name.toLowerCase() === 'content-type'));

    if (!contentType?.value) { return; }

    const value = contentType.value.toLowerCase();
    if (value.includes('application/pdf') || (value.includes('application/octet-stream') && url.toLowerCase().endsWith('.pdf'))) {
        getLocalStorageAsync<PickedOptions>(keys).then(({ enablePdfViewer }) => {
            enablePdfViewer && chrome.tabs.update(tabId, { url: getRedirectURL(url) });
        });
    }
};

chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest, {
    urls: ['ftp://*/*.pdf', 'ftp://*/*.PDF', 'file://*/*.pdf', 'file://*/*.PDF'],
    types: ['main_frame']
}, []);
chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived, {
    urls: ['https://*/*', 'http://*/*'],
    types: ['main_frame']
}, ['responseHeaders']);