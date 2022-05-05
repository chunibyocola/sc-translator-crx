import { GOOGLE_COM, MICROSOFT_COM } from '../../constants/translateSource';
import { DisplayModeEnhancement } from '../../types';
import { getMessage } from '../i18n';
import { bingSwitchLangCode } from '../switch-lang-code';
import { translate as googleWebTranslate } from './google/translate';
import { getAuthorization } from './microsoft/getAuthorization';
import { translate as microsoftWebTranslate } from './microsoft/translate';

type ScWebpageTranslationElement = HTMLElement & { _ScWebpageTranslationKey?: number; };

type PageTranslateItemEnity = {
    prefix: string;
    text: string;
    result?: string[];
    textNodes: Text[];
    fontsNodes: [ScWebpageTranslationElement, ScWebpageTranslationElement][];
    firstTextNodeClientY: number;
    status: 'init' | 'loading' | 'error' | 'finished';
    mapIndex: number;
};


// 0: oringinal TextNode only
// 1: oringinal TextNode and result TextNode
// 2: result TextNode only
let wayOfFontsDisplaying: number = 1;

let waitingList: PageTranslateItemEnity[] = [];
let updatedList: PageTranslateItemEnity[] = [];

const preIgnoreTagRegExp = /^(CANVAS|IFRAME|BR|HR|SVG|IMG|SCRIPT|LINK|STYLE|INPUT|TEXTAREA|CODE|#comment)$/i;
const ignoreTagRegExp = /^(CANVAS|IFRAME|BR|HR|SVG|IMG|SCRIPT|LINK|STYLE|INPUT|TEXTAREA)$/i;
const skipTagRegExp = /^(CODE|#comment)$/i;
let minViewPort = 0;
let maxViewPort = 0;

let resultCache: { [key: string]: string[] } = {};
let resultCacheLanguage = '';
let resultCacheSource = '';

let startFlag = 0;
let closeFlag = 1;

let source = '';
let language = '';

let errorCallback: ((errorReason: string) => void) | undefined;

let displayModeEnhancement: DisplayModeEnhancement = {
    oAndT_Underline: false,
    t_Hovering: false
};

let pageTranslateItemMap: { [key: number]: PageTranslateItemEnity; } = {};
let itemMapIndex = 0;

let displayingItem: null | number = null;
let hoveringItem: null | number = null;
let showPanelTimeout: ReturnType<typeof setTimeout> | null = null;
let hidePanelTimeout: ReturnType<typeof setTimeout> | null = null;
let panelElement: HTMLDivElement | null = null;

const clearAllTimeout = () => {
    if (hidePanelTimeout) {
        clearTimeout(hidePanelTimeout);
        hidePanelTimeout = null;
    }
    if (showPanelTimeout) {
        clearTimeout(showPanelTimeout);
        showPanelTimeout = null;
    }
};

const newPageTranslateItem = (text: string, nodes: Node[]) => {
    const searchIndex = text.search(/[^\s]/);
    const textNodes = getTextNodesFromNodes(nodes);
    
    const range = document.createRange();
    range.selectNode(textNodes[0]);
    const firstTextNodeClientY = range.getBoundingClientRect().top + window.scrollY;

    itemMapIndex += 1;

    const item: PageTranslateItemEnity = {
        prefix: text.substring(0, searchIndex),
        text: text.substring(searchIndex).replace('\n', ' '),
        textNodes,
        fontsNodes: [],
        firstTextNodeClientY,
        status: 'init',
        mapIndex: itemMapIndex
    };

    waitingList.push(item);

    pageTranslateItemMap[itemMapIndex] = item;
};

const dealWithPreElement = (pre: HTMLPreElement) => {
    const childNodes: Node[] = [];
    pre.childNodes.forEach(v => childNodes.push(v));

    childNodes.forEach((v) => {
        if (v.nodeName === '#text') {
            const matchArray =  v.nodeValue?.match(/\n*[^\n]+/g)
            if (matchArray) {
                matchArray.forEach((match) => {
                    const textNode = document.createTextNode(match);
                    pre.insertBefore(textNode, v);
                });

                pre.removeChild(v);
            }
        }
        else if (preIgnoreTagRegExp.test(v.nodeName)) {
            return;
        }
        else {
            getAllTextFromElement(v as HTMLElement);
        }
    });
};

const isPureInlineElement = (inlineElement: HTMLElement) => {
    let nodeStack: { node: Node; index: number }[] = [{ node: inlineElement, index: 0 }];
    let currentNode: { node: Node; index: number } | undefined = nodeStack.shift();

    while (currentNode) {
        for (let i = currentNode.index; i < currentNode.node.childNodes.length; i++) {
            const node = currentNode.node.childNodes[i];
            if (/#comment|#text/.test(node.nodeName)) {
                continue;
            }
            else if (ignoreTagRegExp.test(node.nodeName)) {
                return false;
            }
            else if (window.getComputedStyle(node as HTMLElement).display !== 'inline') {
                return false;
            }
            else {
                nodeStack.unshift({ node, index: 0 }, { node: currentNode.node, index: ++i });
                break;
            }
        }

        currentNode = nodeStack.shift();
    }
    return true;
};

const getTextNodesFromNodes = (nodes: Node[]) => {
    let textNodes: Text[] = [];
    let nodeStack: { node: Node; index: number }[] = nodes.map((v) => ({ node: v, index: 0 }));
    let currentNode: { node: Node; index: number } | undefined = nodeStack.shift();

    while (currentNode) {
        if (currentNode.node.nodeName === '#text' && currentNode.node.nodeValue?.trimLeft()) {
            textNodes.push(currentNode.node as Text);
        }
        else {
            for (let i = currentNode.index; i < currentNode.node.childNodes.length; i++) {
                if (skipTagRegExp.test(currentNode.node.childNodes[i].nodeName)) {
                    continue;
                }
                else if (currentNode.node.childNodes[i].nodeName === '#text' && currentNode.node.childNodes[i].nodeValue?.trimLeft()) {
                    textNodes.push(currentNode.node.childNodes[i] as Text);
                }
                else {
                    nodeStack.unshift({ node: currentNode.node.childNodes[i], index: 0 }, { node: currentNode.node, index: ++i });
                    break;
                }
            }
        }

        currentNode = nodeStack.shift();
    }

    return textNodes;
};


const getAllTextFromElement = (element: HTMLElement) => {
    let elementArr: Node[] = [];
    let text = '';
    let nodeStack: { node: Node; index: number }[] = [{ node: element, index: 0 }];
    let currentNode: { node: Node; index: number } | undefined = nodeStack.shift();

    while (currentNode) {
        for (let i = currentNode.index; i < currentNode.node.childNodes.length; i++) {
            const node = currentNode.node.childNodes[i];
            if (ignoreTagRegExp.test(node.nodeName)) {
                if (elementArr.length > 0 && text.trimLeft()) {
                    newPageTranslateItem(text, elementArr);
                }
    
                elementArr = [];
                text = '';
    
                continue;
            }
            else if (skipTagRegExp.test(node.nodeName)) {
                continue;
            }
            else if (node.nodeName === '#text') {
                if (node.nodeValue?.replace(/\s|[0-9]/g, '')) {
                    elementArr.push(node);
                    text += node.nodeValue;
                }
            }
            else if ((node as HTMLElement).classList.contains('notranslate')) {
                continue;
            }
            // Below, node is definitely a HTMLElement
            else {
                const shadowRoot = (node as HTMLElement).shadowRoot;
                if (shadowRoot) {
                    nodeStack.unshift({ node: shadowRoot, index: 0 });
                }

                if (window.getComputedStyle(node as HTMLElement).display === 'inline' && isPureInlineElement(node as HTMLElement) && (node as HTMLElement).innerText.trimLeft()) {
                    elementArr.push(node);
                    text += (node as HTMLElement).innerText;
                }
                else {
                    if (elementArr.length > 0 && text.trimLeft()) {
                        newPageTranslateItem(text, elementArr);
                    }

                    elementArr = [];
                    text = '';

                    if (node.nodeName === 'PRE') {
                        dealWithPreElement(node as HTMLPreElement);
                    }
                    else {
                        nodeStack.unshift({ node, index: 0 }, { node: currentNode.node, index: ++i });
                        break;
                    }
                }
            }
        }

        if (elementArr.length > 0 && text.trimLeft()) {
            newPageTranslateItem(text, elementArr);
        }

        elementArr = [];
        text = '';

        currentNode = nodeStack.shift();
    }
};

export const startWebPageTranslating = (
    element: HTMLElement,
    translateSource: string,
    targetLanguage: string,
    enhancement: DisplayModeEnhancement,
    errorCb?: (errorReason: string) => void,
) => {
    if (startFlag === closeFlag) { return false; }

    errorCb && (errorCallback = errorCb);

    source = translateSource;
    language = targetLanguage;
    if (language !== resultCacheLanguage || source !== resultCacheSource) {
        resultCache = {};
        resultCacheLanguage = language;
        resultCacheSource = source;
    }

    displayModeEnhancement = enhancement;

    ++startFlag;

    minViewPort = window.scrollY - 500;
    maxViewPort = window.scrollY + window.innerHeight + 500;

    getAllTextFromElement(element);

    handleDelay();

    window.addEventListener('scroll', onWindowScroll, true);

    wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering && window.addEventListener('mousemove', onWindowMouseMove);

    return true;
};

const onWindowScroll = (e: Event) => {
    const element = e.target as HTMLElement;

    if (!element.contains(document.documentElement)) {
        waitingList.forEach((v) => {
            if (!element.contains(v.textNodes[0])) { return ; }

            const range = document.createRange();
            range.selectNode(v.textNodes[0]);
            const { top } = range.getBoundingClientRect();

            if (top > -500 && top < window.innerHeight + 500) {
                v.firstTextNodeClientY = minViewPort + 100;
            }
        });
    }
    else {
        if (window.scrollY - 100 < minViewPort) {
            minViewPort = window.scrollY - 500;
        }
        if (window.scrollY + window.innerHeight + 100 > maxViewPort) {
            maxViewPort = window.scrollY + window.innerHeight + 500;
        }
    }

    handleDelay();
};

const onWindowMouseMove = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    const key = (element as ScWebpageTranslationElement)._ScWebpageTranslationKey;

    if (element.tagName === 'FONT' && key) {
        if (displayingItem && key === displayingItem) {
            clearAllTimeout();
        }
        else if (hoveringItem !== key) {
            clearAllTimeout();

            showPanelTimeout = setTimeout(() => {
                if (!panelElement?.parentElement) {
                    panelElement = document.createElement('div');
                    document.body.parentElement?.insertBefore(panelElement, document.body.nextElementSibling);
                    panelElement.id = 'sc-webpage-translation-panel'
                    panelElement.style.backgroundColor = '#ffffff';
                    panelElement.style.padding = '10px 14px';
                    panelElement.style.fontSize = '14px';
                    panelElement.style.display = 'none';
                    panelElement.style.position = 'fixed';
                    panelElement.style.width = '400px';
                    panelElement.style.boxShadow = 'rgb(0 0 0 / 20%) 0px 0px 15px';
                    panelElement.addEventListener('mousemove', (e: MouseEvent) => {
                        clearAllTimeout();
                        e.stopPropagation();
                    });
                }

                if (displayingItem) {
                    if (wayOfFontsDisplaying === 2) {
                        pageTranslateItemMap[displayingItem].fontsNodes.forEach(([, v]) => {
                            v.style.backgroundColor = '';
                            v.style.boxShadow = '';
                        });
                    }
                }

                displayingItem = key;

                const titleElement: HTMLElement = panelElement.querySelector('.sc-webpage-translation__title') ?? document.createElement('div');
                titleElement.className = 'sc-webpage-translation__title';
                titleElement.style.color = '#999';
                const contentElement: HTMLElement = panelElement.querySelector('.sc-webpage-translation__content') ?? document.createElement('div');
                contentElement.className = 'sc-webpage-translation__content';
                contentElement.style.maxHeight = '100px';
                contentElement.style.overflowY = 'auto';
                contentElement.style.marginTop = '10px';
                contentElement.style.color = '#000000';

                if (wayOfFontsDisplaying === 2) {
                    titleElement.innerText = getMessage('optionsOriginalText');
                    contentElement.innerText = pageTranslateItemMap[displayingItem].text;
                    pageTranslateItemMap[displayingItem].fontsNodes.forEach(([, v]) => {
                        v.style.backgroundColor = '#c9d7f1';
                        v.style.boxShadow = '2px 2px 4px #9999aa';
                    });
                }

                panelElement.appendChild(titleElement);
                panelElement.appendChild(contentElement);

                panelElement.style.display = '';
                const { width, height } = panelElement.getBoundingClientRect();
                panelElement.style.left = `${Math.max(e.clientX + 25 - Math.max((e.clientX + 35 + width) - window.innerWidth, 0), 10)}px`;
                panelElement.style.top = `${e.clientY + 15 - Math.max((e.clientY + 25 + height) - window.innerHeight, 0)}px`;

                showPanelTimeout = null;
            }, 1000);
        }

        hoveringItem = key;
    }
    else if ((displayingItem || showPanelTimeout) && !hidePanelTimeout) {
        clearAllTimeout();

        hoveringItem = null;
        hidePanelTimeout = setTimeout(() => {
            if (displayingItem) {
                if (wayOfFontsDisplaying === 2) {
                    pageTranslateItemMap[displayingItem].fontsNodes.forEach(([, v]) => {
                        v.style.backgroundColor = '';
                        v.style.boxShadow = '';
                    });
                }
            }
            displayingItem = null;
            if (panelElement) {
                panelElement.style.display = 'none';
            }

            hidePanelTimeout = null;
        }, 500);
    }
    else if (hoveringItem) {
        hoveringItem = null;
    }
};

export const closeWebPageTranslating = () => {
    if (closeFlag > startFlag) { return; }

    source = '';
    language = '';

    ++closeFlag;

    updatedList.forEach((item) => {
        item.fontsNodes.forEach((fontsNode) => {
            const originalFont = fontsNode[0];
            const resultFont = fontsNode[1];

            originalFont.childNodes.forEach(childNode => originalFont.parentElement?.insertBefore(childNode, originalFont));

            originalFont.parentElement?.removeChild(originalFont);
            resultFont.parentElement?.removeChild(resultFont);
        });
    });

    waitingList = [];
    updatedList = [];

    pageTranslateItemMap = {};
    itemMapIndex = 0;

    displayingItem = null;
    hoveringItem = null;
    
    clearAllTimeout();

    if (panelElement) {
        panelElement.parentElement?.removeChild(panelElement);
        panelElement = null;
    }

    window.removeEventListener('scroll', onWindowScroll, true);

    window.removeEventListener('mousemove', onWindowMouseMove);
};

const delay = (fn: () => void, ms: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return () => {
        if (timeout) { return; }
        timeout = setTimeout(() => {
            fn();
            timeout = null;
        }, ms);
    };
};

const handleDelay = delay(() => {
    const nextTranslateList = waitingList.filter(v => v.firstTextNodeClientY >= minViewPort && v.firstTextNodeClientY <= maxViewPort);

    if (nextTranslateList.length === 0) { return; }

    waitingList = waitingList.filter(v => !(v.firstTextNodeClientY >= minViewPort && v.firstTextNodeClientY <= maxViewPort));
    updatedList = updatedList.concat(nextTranslateList);

    switch (source) {
        case GOOGLE_COM:
            googleWebTranslateProcess(nextTranslateList, language);
            break;
        case MICROSOFT_COM:
            microsoftWebTranslateProcess(nextTranslateList, bingSwitchLangCode(language));
            break;
        default: break;
    }
}, 500);

const microsoftWebTranslateProcess = (nextTranslateList: PageTranslateItemEnity[], targetLanguage: string) => {
    if (nextTranslateList.length === 0) { return; }

    let translateList: { requestArray: { Text: string }[], pageTranslateList: PageTranslateItemEnity[], textList: string[] }[] = [];

    let pageTranslateList: PageTranslateItemEnity[] = [];
    let text = '';
    let requestCount = 0;
    let requestArray: { Text: string }[] = [];
    let textList: string[] = [];
    for (let i = 0; i < nextTranslateList.length; i++) {
        let currentItem = nextTranslateList[i];

        const request = currentItem.textNodes.length === 1 ?
            (currentItem.textNodes[0].nodeValue ?? '') :
            currentItem.textNodes.reduce((t, v, i) => (t + `<b${i}>${microsoftEscapeText(v.nodeValue ?? '')}</b${i}>`), '');
        
        if (request in resultCache) {
            currentItem.result = resultCache[request];
            currentItem.status = 'finished';
            currentItem.textNodes.forEach((textNode, i) => {
                if (!textNode.parentElement || !currentItem.result?.[i]) { return; }

                const fonts = insertResultAndWrapOriginalTextNode(textNode, currentItem.result[i], currentItem.mapIndex);
                fonts && currentItem.fontsNodes.push(fonts);
            });

            continue;
        }

        if (text.length + request.length < 1024 && requestCount <= 80) {
            requestArray.push({ Text: request });
            pageTranslateList.push(currentItem);
            textList.push(request);
            text += request;
            ++requestCount;
        }
        else {
            translateList.push({ requestArray, pageTranslateList, textList });
            pageTranslateList = [currentItem];
            requestArray = [{ Text: request }];
            textList = [request];
            text = request;
            requestCount = 1;
        }
    }
    if (text) {
        translateList.push({ requestArray, pageTranslateList, textList });
    }

    if (translateList.length === 0) { return; }

    const tempCloseFlag = closeFlag;

    getAuthorization().then(() => {
        translateList.forEach((item) => {
            const dealWithResult = (result: string[][]) => {
                item.pageTranslateList.forEach((v, i) => {
                    v.result = result[i];
                    v.status = 'finished';
                    v.textNodes.forEach((textNode, i) => {
                        if (!textNode.parentElement || !v.result?.[i]) { return; }
        
                        const fonts = insertResultAndWrapOriginalTextNode(textNode, v.result[i], v.mapIndex);
                        fonts && v.fontsNodes.push(fonts);
                    });
                });
            };
    
            microsoftWebTranslate(item.requestArray, targetLanguage).then((result) => {
                item.textList.length === result.length && item.textList.forEach((v, i) => (resultCache[v] = result[i]));
    
                // if not the same, means web page translate has been closed.
                tempCloseFlag === closeFlag && dealWithResult(result);
            }).catch((reason) => {
                item.pageTranslateList.forEach(v => v.status = 'error');
                errorCallback?.(reason.code);
            });
    
            item.pageTranslateList.forEach(v => v.status = 'loading');
        });
    }).catch(() => {
        translateList.forEach((list) => {
            list.pageTranslateList.forEach(v => v.status = 'error');
        });
        errorCallback?.('Microsoft: get authorization failed.');
    });
};

const googleWebTranslateProcess = (nextTranslateList: PageTranslateItemEnity[], targetLanguage: string) => {
    if (nextTranslateList.length === 0) { return; }

    let translateList: { searchParams: URLSearchParams, pageTranslateList: PageTranslateItemEnity[], totalQText: string, qList: string[] }[] = [];

    let pageTranslateList: PageTranslateItemEnity[] = [];
    let searchParams = new URLSearchParams();
    let text = '';
    let qCount = 0;
    let qList: string[] = [];
    for (let i = 0; i < nextTranslateList.length; i++) {
        let currentItem = nextTranslateList[i];

        const q = currentItem.textNodes.length === 1 ?
            (currentItem.textNodes[0].nodeValue ?? '') :
            currentItem.textNodes.reduce((t, v, i) => (t + `<a i=${i}>${escapeText(v.nodeValue ?? '')}</a>`), '');

        if (q in resultCache) {
            currentItem.result = resultCache[q];
            currentItem.status = 'finished';
            currentItem.textNodes.forEach((textNode, i) => {
                if (!textNode.parentElement || !currentItem.result?.[i]) { return; }

                const fonts = insertResultAndWrapOriginalTextNode(textNode, currentItem.result[i], currentItem.mapIndex);
                fonts && currentItem.fontsNodes.push(fonts);
            });

            continue;
        }

        if (text.length + q.length < 1024 && qCount <= 100) {
            searchParams.append('q', q);
            pageTranslateList.push(currentItem);
            qList.push(q);
            text += q;
            ++qCount;
        }
        else {
            translateList.push({ searchParams, pageTranslateList, totalQText: text, qList });
            pageTranslateList = [currentItem];
            searchParams = new URLSearchParams();
            searchParams.append('q', q);
            qList = [q];
            text = q;
            qCount = 1;
        }
    }
    if (text) {
        translateList.push({ searchParams, pageTranslateList, totalQText: text, qList });
    }

    if (translateList.length === 0) { return; }

    const tempCloseFlag = closeFlag;

    translateList.forEach((item) => {
        const dealWithResult = (result: string[][]) => {
            item.pageTranslateList.forEach((v, i) => {
                v.result = result[i];
                v.status = 'finished';
                v.textNodes.forEach((textNode, i) => {
                    if (!textNode.parentElement || !v.result?.[i]) { return; }
    
                    const fonts = insertResultAndWrapOriginalTextNode(textNode, v.result[i], v.mapIndex);
                    fonts && v.fontsNodes.push(fonts);
                });
            });
        };

        googleWebTranslate(item.searchParams, item.totalQText, targetLanguage).then((result) => {
            item.qList.length === result.length && item.qList.forEach((v, i) => (resultCache[v] = result[i]));

            // if not the same, means web page translate has been closed.
            tempCloseFlag === closeFlag && dealWithResult(result);
        }).catch((reason) => {
            item.pageTranslateList.forEach(v => v.status = 'error');
            errorCallback?.(reason.code);
        });

        item.pageTranslateList.forEach(v => v.status = 'loading');
    });
};

export const errorRetry = () => {
    const nextTranslateList = updatedList.filter(v => v.status === 'error');

    if (nextTranslateList.length === 0) { return; }

    switch (source) {
        case GOOGLE_COM:
            googleWebTranslateProcess(nextTranslateList, language);
            break;
        case MICROSOFT_COM:
            microsoftWebTranslateProcess(nextTranslateList, bingSwitchLangCode(language));
            break;
        default: break;
    }
};

const insertResultAndWrapOriginalTextNode = (textNode: Text, result: string, mapIndex: number): [ScWebpageTranslationElement, ScWebpageTranslationElement] | void => {
    if (!textNode.parentElement) { return; }

    const originalFont: ScWebpageTranslationElement = document.createElement('font');
    const resultFont: ScWebpageTranslationElement = document.createElement('font');

    originalFont._ScWebpageTranslationKey = mapIndex;
    resultFont._ScWebpageTranslationKey = mapIndex;

    dealWithFontsStyle(originalFont, resultFont);

    textNode.parentElement.insertBefore(originalFont, textNode);
    textNode.parentElement.insertBefore(resultFont, textNode);

    originalFont.appendChild(textNode);
    resultFont.appendChild(document.createTextNode(result));

    return [originalFont, resultFont];
};

export const switchWayOfFontsDisplaying = (way?: number) => {
    if (way === undefined) {
        wayOfFontsDisplaying = ++wayOfFontsDisplaying % 3;
    }
    else {
        wayOfFontsDisplaying = Math.floor(way) % 3
    }

    if (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering) {
        window.addEventListener('mousemove', onWindowMouseMove);
    }
    else {
        clearAllTimeout();

        hoveringItem = null;
        displayingItem = null;
        if (panelElement) {
            panelElement.style.display = 'none';
        }

        window.removeEventListener('mousemove', onWindowMouseMove);
    }

    updatedList.forEach((item) => {
        item.fontsNodes.forEach(v => dealWithFontsStyle(v[0], v[1]));
    });
};

const dealWithFontsStyle = (originalFont: ScWebpageTranslationElement, resultFont: ScWebpageTranslationElement) => {
    switch (wayOfFontsDisplaying) {
        case 0:
            originalFont.setAttribute('style', '');
            resultFont.setAttribute('style', 'display: none;');
            return;
        case 1:
            originalFont.setAttribute('style', '');
            resultFont.setAttribute('style', `margin: 0 5px;${displayModeEnhancement.oAndT_Underline ? ' border-bottom: 2px solid #72ECE9; padding: 0 2px;' : ''}`);
            return;
        default:
            originalFont.setAttribute('style', 'display: none;');
            resultFont.setAttribute('style', '');
            return;
    }
};

const escapeText = (text: string) => {
    return text.replace(/<|>|&|"|'/g, (match) => {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '"': return '&quot;';
            case '\'': return '&#39;';
            default: return match;
        }
    });
};

const microsoftEscapeText = (text: string) => {
    return text.replace(/<|>|&/g, (match) => {
        switch (match) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            default: return match;
        }
    });
};

export const unescapeText = (text: string) => {
    return text.replace(/&[^;]+;/g, (match) => {
        switch (match) {
            case '&lt;': return '<';
            case '&gt;': return '>';
            case '&amp;': return '&';
            case '&quot;': return '"';
            case '&#39;': return '\'';
            default: return match;
        }
    });
};