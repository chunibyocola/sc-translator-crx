import { queryTabs, sendMessageToTab } from '../chrome-call';

export const resultToString = result => result.reduce((t, c) => (t + c), '');

export const getCurrentTab = (cb) => {
    queryTabs({ active: true, lastFocusedWindow: true }, tabs => cb(tabs[0]));
};

/* global chrome */
export const getIsContentScriptEnabled = async (tabId) => {
    return await new Promise((resolve, reject) => {
        sendMessageToTab(tabId, 'Are you enabled?', () => {
            if (chrome.runtime.lastError) reject(false);
            resolve(true);
        });
    }).catch(() => false);
};

export const getIsEnabled = (host, hostList, mode) => {
    const find = hostList.some(v => host.endsWith(v));
    return mode ? !find : find;
};

export const getCurrentTabHost = async () => {
    return await new Promise((resolve, reject) => {
        getCurrentTab(tab => sendMessageToTab(tab.id, 'Are you enabled?', (tabData) => {
            chrome.runtime.lastError && reject(null);

            resolve(tabData?.host);
        }));
    }).catch(() => null);
};

export const drag = (element, currentPosition, mouseMoveCallback, mouseUpCallback) => {
    const originX = element.clientX;
    const originY = element.clientY;
    const tempX = currentPosition.x;
    const tempY = currentPosition.y;
    let newX = tempX;
    let newY = tempY;

    const mouseMoveListener = (e) => {
        const nowX = e.clientX;
        const nowY = e.clientY;
        const diffX = originX - nowX;
        const diffY = originY - nowY;
        newX = tempX - diffX;
        newY = tempY - diffY;
        mouseMoveCallback({ x: newX, y: newY });
    };

    const mouseUpListener = () => {
        document.removeEventListener('mousemove', mouseMoveListener, true);
        document.removeEventListener('mouseup', mouseUpListener, true);
        document.onselectstart = () => { return true; };
        mouseUpCallback({ x: newX, y: newY });
    };

    document.onselectstart = () => { return false; };
    document.addEventListener('mousemove', mouseMoveListener, true);
    document.addEventListener('mouseup', mouseUpListener, true);
};

const resultBoxMargin = 5;
export const calculatePosition = (element, { x, y }, callback) => {
    const dH = document.documentElement.clientHeight;
    const dW = document.documentElement.clientWidth;
    const rbW = element.clientWidth;
    const rbH = element.clientHeight;
    const rbL = x;
    const rbT = y;
    const rbB = rbT + rbH;
    const rbR = rbL + rbW;
    // show top and right prior
    if (rbL < resultBoxMargin) x = resultBoxMargin;
    if (rbR > dW) x = dW - resultBoxMargin - rbW;
    if (rbB > dH) y = dH - resultBoxMargin - rbH;
    if (y < resultBoxMargin) y = resultBoxMargin;
    callback({ x, y });
};

export const debounce = (cb, time) => {
    let timeout = null;
    return () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(cb, time);
    };
};