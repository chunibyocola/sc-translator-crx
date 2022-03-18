import { DefaultOptions, Position } from '../../types';
import { queryTabs, sendMessageToTab } from '../chrome-call';

export const resultToString = (result: string[]) => (result.reduce((t, c) => (t + c), ''));

export const getCurrentTab = (cb: (tab?: chrome.tabs.Tab) => void) => {
    queryTabs({ active: true, lastFocusedWindow: true }, tabs => cb(tabs[0]));
};

export const getIsContentScriptEnabled = async (tabId?: number):Promise<boolean> => {
    return await new Promise((resolve, reject) => {
        try {
            if (!tabId) {
                resolve(false);
                return;
            }
            sendMessageToTab(tabId, 'Are you enabled?', () => {
                if (chrome.runtime.lastError) resolve(false);
                resolve(true);
            });
        }
        catch {
            resolve(false);
        }
    });
};

export const getLocalStorageAsync = <T extends Partial<DefaultOptions>>(keys: (keyof T)[]): Promise<T> => {
    return new Promise((resolve) => {
        chrome.storage.local.get(keys, data => resolve(data as T));
    });
};

export const getIsEnabled = (host: string, hostList: string[], mode: boolean) => {
    const find = hostList.some(v => host.endsWith(v));
    return mode ? !find : find;
};

export const getCurrentTabHost = async (tabId?: number): Promise<string> => {
    return await new Promise((resolve, reject) => {
        const callback = (tabId: number) => sendMessageToTab(tabId, 'Are you enabled?', (tabData) => {
            chrome.runtime.lastError && resolve('');

            resolve(tabData?.host);
        });
        tabId ? callback(tabId) : getCurrentTab(tab => tab?.id ? callback(tab.id) : resolve(''));
    });
};

export const drag = (event: MouseEvent, currentPosition: Position, mouseMoveCallback: (pos: Position) => void, mouseUpCallback: (pos: Position) => void) => {
    const originX = event.clientX;
    const originY = event.clientY;
    const tempX = currentPosition.x;
    const tempY = currentPosition.y;
    let newX = tempX;
    let newY = tempY;

    const mouseMoveListener = (e: MouseEvent) => {
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

export const calculatePosition = (element: HTMLElement, { x, y }: Position, margin = 5): Position => {
    const dH = document.documentElement.clientHeight;
    const dW = document.documentElement.clientWidth;
    const rbW = element.clientWidth;
    const rbH = element.clientHeight;
    const rbL = x;
    const rbT = y;
    const rbB = rbT + rbH;
    const rbR = rbL + rbW;
    // show top and right prior
    if (rbL < margin) x = margin;
    if (rbR > dW) x = dW - margin - rbW;
    if (rbB > dH) y = dH - margin - rbH;
    if (y < margin) y = margin;
    
    return { x, y };
};

export const debounce = (cb: Function, time: number) => {
    let timeout: number | undefined;
    return () => {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(cb, time);
    };
};

export const mouseDrag = (mouseMoveCallback: (pos: Position) => void, mouseUpCallback: (pos: Position) => void) => {
    const mouseMoveListener = (e: MouseEvent) => {
        mouseMoveCallback?.({ x: e.clientX, y: e.clientY });
    };

    const mouseUpListener = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mouseMoveListener, true);
        document.removeEventListener('mouseup', mouseUpListener, true);
        document.onselectstart = () => { return true; };
        mouseUpCallback?.({ x: e.clientX, y: e.clientY });
    };

    document.onselectstart = () => { return false; };
    document.addEventListener('mousemove', mouseMoveListener, true);
    document.addEventListener('mouseup', mouseUpListener, true);
};

export const isTextBox = (element: Element) => {
    return (element.tagName === 'INPUT' && ((element as HTMLInputElement).type === 'text' || (element as HTMLInputElement).type === 'search'))
        || element.tagName === 'TEXTAREA'
        || (element as HTMLElement).isContentEditable;
};