import { GOOGLE_COM, MICROSOFT_COM } from '../../constants/translateSource';
import { DisplayModeEnhancement } from '../../types';
import { getMessage } from '../i18n';
import { bingSwitchLangCode } from '../switch-lang-code';
import { translate as googleWebTranslate } from './google/translate';
import { translate as microsoftWebTranslate } from './microsoft/translate';
import { translate as customWebTranslate } from './custom/translate';
import { getError } from '../translate/utils';

export type WebpageTranslateResult = {
    translations: string[];
    comparisons?: string[];
};
type WebpageTranslateParams = {
    paragraphs: string[][];
    keys: string[];
    targetLanguage: string;
};
export type WebpageTranslateFn = (params: WebpageTranslateParams, source: string) => Promise<WebpageTranslateResult[]>;

type ScWebpageTranslationElement = HTMLElement & { _ScWebpageTranslationKey?: number; };
type ItemFonts = [ScWebpageTranslationElement, ScWebpageTranslationElement | null, ScWebpageTranslationElement];

type PageTranslateItemEnity = {
    prefix: string;
    text: string;
    result?: WebpageTranslateResult;
    textNodes: Text[];
    fontsNodes: ItemFonts[];
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

const ignoredTagsArr = ['canvas', 'iframe', 'br', 'hr', 'svg', 'img', 'script', 'link', 'style', 'input', 'textarea'];
const skippedTagsArr = ['code', '#comment'];
const ignoredTags = new Set(ignoredTagsArr.concat(ignoredTagsArr.map(v => v.toUpperCase())));
const skippedTags = new Set(skippedTagsArr.concat(skippedTagsArr.map(v => v.toUpperCase())));
let minViewPort = 0;
let maxViewPort = 0;

let resultCache: { [key: string]: WebpageTranslateResult } = {};
let resultCacheLanguage = '';
let resultCacheSource = '';

let startFlag = 0;
let closeFlag = 1;

let source = '';
let language = '';

let errorCallback: ((errorReason: string) => void) | undefined;

let displayModeEnhancement: DisplayModeEnhancement = {
    o_Hovering: false,
    oAndT_Underline: false,
    oAndT_NonDiscrete: false,
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
        else if (ignoredTags.has(v.nodeName) || skippedTags.has(v.nodeName)) {
            return;
        }
        else {
            getAllTextFromElement(v as HTMLElement);
        }
    });
};

const isPureInlineElement = (inlineElement: HTMLElement) => {
    let nodeStack: { node: Element; index: number }[] = [{ node: inlineElement, index: 0 }];
    let currentNode = nodeStack.shift();

    while (currentNode) {
        for (let i = currentNode.index; i < currentNode.node.children.length; i++) {
            const node = currentNode.node.children[i];
            if (ignoredTags.has(node.nodeName)) {
                return false;
            }
            else if (window.getComputedStyle(node).display !== 'inline') {
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
    let currentNode = nodeStack.shift();

    while (currentNode) {
        if (currentNode.node.nodeName === '#text') {
            currentNode.node.nodeValue?.trim() && textNodes.push(currentNode.node as Text);
        }
        else {
            for (let i = currentNode.index; i < currentNode.node.childNodes.length; i++) {
                const node = currentNode.node.childNodes[i];
                if (skippedTags.has(node.nodeName)) {
                    continue;
                }
                else if (node.nodeName === '#text') {
                    node.nodeValue?.trim() && textNodes.push(node as Text);
                }
                else {
                    nodeStack.unshift({ node, index: 0 }, { node: currentNode.node, index: ++i });
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
    let currentNode = nodeStack.shift();

    while (currentNode) {
        for (let i = currentNode.index; i < currentNode.node.childNodes.length; i++) {
            const node = currentNode.node.childNodes[i];
            if (ignoredTags.has(node.nodeName)) {
                if (elementArr.length > 0 && text.trim()) {
                    newPageTranslateItem(text, elementArr);
                }
    
                elementArr = [];
                text = '';
    
                continue;
            }
            else if (skippedTags.has(node.nodeName)) {
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

                if (window.getComputedStyle(node as HTMLElement).display === 'inline' && isPureInlineElement(node as HTMLElement)) {
                    if ((node as HTMLElement).innerText?.trim()) {
                        elementArr.push(node);
                        text += (node as HTMLElement).innerText;
                    }
                }
                else {
                    if (elementArr.length > 0 && text.trim()) {
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

        if (elementArr.length > 0 && text.trim()) {
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

    if ((wayOfFontsDisplaying === 0 && displayModeEnhancement.o_Hovering) || (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering)) {
        window.addEventListener('mousemove', onWindowMouseMove);
    }

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
                    if (wayOfFontsDisplaying === 0) {
                        pageTranslateItemMap[displayingItem].fontsNodes.forEach(([v]) => {
                            v.style.backgroundColor = '';
                            v.style.boxShadow = '';
                        });
                    }
                    else if (wayOfFontsDisplaying === 2) {
                        pageTranslateItemMap[displayingItem].fontsNodes.forEach(([,, v]) => {
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

                if (wayOfFontsDisplaying === 0) {
                    titleElement.innerText = getMessage('optionsTranslation');
                    contentElement.innerText = pageTranslateItemMap[displayingItem].fontsNodes.reduce((t, [,, v]) => (t + v.innerText), '');
                    pageTranslateItemMap[displayingItem].fontsNodes.forEach(([v]) => {
                        v.style.backgroundColor = '#c9d7f1';
                        v.style.boxShadow = '2px 2px 4px #9999aa';
                    });
                }
                else if (wayOfFontsDisplaying === 2) {
                    titleElement.innerText = getMessage('optionsOriginalText');
                    contentElement.innerText = pageTranslateItemMap[displayingItem].text;
                    pageTranslateItemMap[displayingItem].fontsNodes.forEach(([,, v]) => {
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
                if (wayOfFontsDisplaying === 0) {
                    pageTranslateItemMap[displayingItem].fontsNodes.forEach(([v]) => {
                        v.style.backgroundColor = '';
                        v.style.boxShadow = '';
                    });
                }
                else if (wayOfFontsDisplaying === 2) {
                    pageTranslateItemMap[displayingItem].fontsNodes.forEach(([,, v]) => {
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
        item.fontsNodes.forEach(([originalFont, comparisonFont, translationFont]) => {
            originalFont.childNodes.forEach(childNode => originalFont.parentElement?.insertBefore(childNode, originalFont));

            originalFont.parentElement?.removeChild(originalFont);
            comparisonFont?.parentElement?.removeChild(comparisonFont);
            translationFont.parentElement?.removeChild(translationFont);
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

    startProcessing(nextTranslateList);
}, 500);

const feedDataToPageTranslateItem = (pageTranslateItem: PageTranslateItemEnity, result: WebpageTranslateResult) => {
    pageTranslateItem.result = result;
    const comparisons = preprocessComparisons(pageTranslateItem.result);
    pageTranslateItem.status = 'finished';
    pageTranslateItem.textNodes.forEach((textNode, i) => {
        if (!textNode.parentElement || typeof pageTranslateItem.result?.translations[i] !== 'string') { return; }

        const fonts = insertResultAndWrapOriginalTextNode(textNode, pageTranslateItem.mapIndex, pageTranslateItem.result.translations[i], comparisons[i]);
        fonts && pageTranslateItem.fontsNodes.push(fonts);
    });
};

type KeyFormat = (paragraph: string[]) => string;
type TranslateItem = {
    paragraphs: string[][],
    pageTranslateList: PageTranslateItemEnity[],
    keys: string[]
};
const getTranslateList = (nextTranslateList: PageTranslateItemEnity[], keyFormat: KeyFormat, options = { maxParagraphCount: 100, maxTextLength: 1024 }) => {
    if (nextTranslateList.length === 0) { return [] as TranslateItem[]; }

    let translateList: TranslateItem[] = [{
        paragraphs: [],
        pageTranslateList: [],
        keys: []
    }];

    let text = '';

    nextTranslateList.forEach((pageTranslateItem) => {
        const paragraph = pageTranslateItem.textNodes.map(textNode => textNode.nodeValue ?? '');
        const key = keyFormat(paragraph);

        if (resultCache[key]) {
            feedDataToPageTranslateItem(pageTranslateItem, resultCache[key]);
            return;
        }

        const { paragraphs, pageTranslateList, keys } = translateList[translateList.length - 1];

        if ((text.length + key.length < options.maxTextLength && paragraphs.length < options.maxParagraphCount) || pageTranslateList.length === 0) {
            paragraphs.push(paragraph);
            pageTranslateList.push(pageTranslateItem);
            keys.push(key);
            text += key;
        }
        else {
            translateList.push({ paragraphs: [paragraph], pageTranslateList: [pageTranslateItem], keys: [key] });
            text = key;
        }
    });

    if (translateList.length === 1 && translateList[0].pageTranslateList.length === 0) { return [] as TranslateItem[]; }

    return translateList;
};

const googleWebTranslateKeyFormat: KeyFormat = (paragraph) => {
    return paragraph.length === 1 ? paragraph[0] : paragraph.reduce((t, v, i) => (`${t}<a i=${i}>${escapeText(v)}</a>`), '');
};
const microsoftWebTranslateKeyFormat: KeyFormat = (paragraph) => {
    return paragraph.length === 1 ? paragraph[0] : paragraph.reduce((t, v, i) => (`${t}<b${i}>${microsoftEscapeText(v)}</b${i}>`), '');
};
const customWebTranslateKeyFormat: KeyFormat = paragraph => paragraph.join('<b />');
const getKeyFormatFn = () => {
    if (source === GOOGLE_COM) {
        return googleWebTranslateKeyFormat;
    }
    else if (source === MICROSOFT_COM) {
        return microsoftWebTranslateKeyFormat;
    }
    else {
        return customWebTranslateKeyFormat;
    }
};

const startProcessing = (nextTranslateList: PageTranslateItemEnity[]) => {
    const translateList = getTranslateList(nextTranslateList, getKeyFormatFn());

    if (translateList.length === 0) { return; }

    let translate: WebpageTranslateFn;
    let targetLanguage = language;

    if (source === GOOGLE_COM) {
        translate = googleWebTranslate;
    }
    else if (source === MICROSOFT_COM) {
        translate = microsoftWebTranslate;
        targetLanguage = bingSwitchLangCode(language);
    }
    else {
        translate = customWebTranslate;
    }

    const tempCloseFlag = closeFlag;

    translateList.forEach(({ paragraphs, pageTranslateList, keys }) => {
        translate({ paragraphs, keys, targetLanguage }, source).then((result) => {
            // if not the same, means web page translate has been closed.
            if (tempCloseFlag !== closeFlag) { return; }

            if (keys.length !== result.length) { throw getError(`Error: "result"'s length is not the same as "paragraphs"'s.`); }

            pageTranslateList.forEach((pageTranslateItem, i) => {
                resultCache[keys[i]] = result[i];
                feedDataToPageTranslateItem(pageTranslateItem, result[i]);
            });
        }).catch((reason) => {
            pageTranslateList.forEach(v => v.status = 'error');
            errorCallback?.(reason.code ?? reason.message ?? 'Error: Unknown Error.');
        });

        pageTranslateList.forEach(v => v.status = 'loading');
    });
};

export const errorRetry = () => {
    const nextTranslateList = updatedList.filter(v => v.status === 'error');

    if (nextTranslateList.length === 0) { return; }

    startProcessing(nextTranslateList);
};

const preprocessComparisons = (webpageTranslateResult: WebpageTranslateResult) => {
    let comparisons = webpageTranslateResult.comparisons ?? webpageTranslateResult.translations;

    if (displayModeEnhancement.oAndT_NonDiscrete) {
        const length = webpageTranslateResult.translations.length;
        comparisons = new Array(length).fill(null);
        comparisons[length - 1] = webpageTranslateResult.translations.join('');
    }

    return comparisons;
};

const insertResultAndWrapOriginalTextNode = (textNode: Text, mapIndex: number, translation: string, comparison: string | null): ItemFonts | void => {
    if (!textNode.parentElement) { return; }

    const originalFont: ScWebpageTranslationElement = document.createElement('font');
    const comparisonFont: ScWebpageTranslationElement | null = typeof comparison === 'string' ? document.createElement('font') : null;
    const translationFont: ScWebpageTranslationElement = document.createElement('font');

    originalFont._ScWebpageTranslationKey = mapIndex;
    comparisonFont && (comparisonFont._ScWebpageTranslationKey = mapIndex);
    translationFont._ScWebpageTranslationKey = mapIndex;

    textNode.parentElement.insertBefore(originalFont, textNode);
    comparisonFont && textNode.parentElement.insertBefore(comparisonFont, textNode);
    textNode.parentElement.insertBefore(translationFont, textNode);

    originalFont.appendChild(textNode);
    comparisonFont && comparison && comparisonFont.appendChild(document.createTextNode(comparison));
    translationFont.appendChild(document.createTextNode(translation));

    const itemFonts: ItemFonts = [originalFont, comparisonFont, translationFont];

    dealWithFontsStyle(itemFonts);

    return itemFonts;
};

export const switchWayOfFontsDisplaying = (way?: number) => {
    if (way === undefined) {
        wayOfFontsDisplaying = ++wayOfFontsDisplaying % 3;
    }
    else {
        wayOfFontsDisplaying = Math.floor(way) % 3
    }

    clearAllTimeout();

    hoveringItem = null;
    displayingItem = null;
    if (panelElement) {
        panelElement.style.display = 'none';
    }

    window.removeEventListener('mousemove', onWindowMouseMove);

    if ((wayOfFontsDisplaying === 0 && displayModeEnhancement.o_Hovering) || (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering)) {
        window.addEventListener('mousemove', onWindowMouseMove);
    }

    updatedList.forEach((item) => {
        item.fontsNodes.forEach(dealWithFontsStyle);
    });
};

const dealWithFontsStyle = ([originalFont, comparisonFont, translationFont]: ItemFonts) => {
    switch (wayOfFontsDisplaying) {
        case 0:
            originalFont.setAttribute('style', '');
            comparisonFont?.setAttribute('style', 'display: none;');
            translationFont.setAttribute('style', 'display: none;');
            return;
        case 1:
            originalFont.setAttribute('style', '');
            comparisonFont?.setAttribute('style', `margin: 0 5px;${displayModeEnhancement.oAndT_Underline ? ' border-bottom: 2px solid #72ECE9; padding: 0 2px;' : ''}`);
            translationFont.setAttribute('style', 'display: none;');
            return;
        default:
            originalFont.setAttribute('style', 'display: none;');
            comparisonFont?.setAttribute('style', 'display: none;');
            translationFont.setAttribute('style', '');
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