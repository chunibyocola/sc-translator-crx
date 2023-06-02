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
    codeTexts: (string[] | undefined)[];
    originalText: string;
    result?: WebpageTranslateResult;
    translation?: string;
    textNodes: Text[];
    fontsNodes: ItemFonts[];
    range: Range;
    status: 'init' | 'loading' | 'error' | 'finished';
    mapIndex: number;
};


// 0: oringinal TextNode only
// 1: oringinal TextNode and result TextNode
// 2: result TextNode only
let wayOfFontsDisplaying: number = 1;

let waitingList: Set<PageTranslateItemEnity> = new Set();
let updatedList: Set<PageTranslateItemEnity> = new Set();

const ignoredTagsArr = ['canvas', 'iframe', 'br', 'hr', 'svg', 'img', 'script', 'link', 'style', 'input', 'textarea', 'font'];
const skippedTagsArr = ['code', '#comment'];
const ignoredTags = new Set(ignoredTagsArr.concat(ignoredTagsArr.map(v => v.toUpperCase())));
const skippedTags = new Set(skippedTagsArr.concat(skippedTagsArr.map(v => v.toUpperCase())));

let pendingMap: Map<string, Set<PageTranslateItemEnity>> = new Map();
let cacheMap: Map<string, WebpageTranslateResult> = new Map();

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

let checkedNodes: WeakSet<Node> = new WeakSet();

let translateDynamicContent = false;

const observer = new MutationObserver((records) => {
    const noTranslate = (element: Element | null) => {
        if (!document.body.contains(element)) {
            return true;
        }
        while (element) {
            const tagName = element.nodeName;
            if (skippedTags.has(tagName) || ignoredTags.has(tagName)) {
                return true;
            }
            if (element.classList.contains('notranslate')) {
                return true;
            }
            if ((element as HTMLElement).isContentEditable) {
                return true;
            }
            element = element.parentElement;
            if (element === document.body) {
                break;
            }
        }
        return false;
    };

    const targets = new Set<Element>();

    records.forEach(({ type, target, addedNodes }) => {
        let nextTarget: Element | null = null;

        if (type === 'characterData') {
            nextTarget = target.parentElement;
            [target, target.parentElement].forEach(node => node && checkedNodes.delete(node));
        }

        if (type === 'childList' && addedNodes.length > 0) {
            nextTarget = target as Element;
            [target, ...addedNodes].forEach(node => checkedNodes.delete(node));
        }

        if (nextTarget && !noTranslate(nextTarget) && !targets.has(nextTarget)) {
            targets.add(nextTarget);

            for (const element of targets) {
                if (element === nextTarget) {
                    continue;
                }

                let currentElement: Element | null = null;
                let rootElement: Element | null = null;

                if (nextTarget.contains(element)) {
                    currentElement = element;
                    rootElement = nextTarget;
                }
                else if (element.contains(nextTarget)) {
                    currentElement = nextTarget;
                    rootElement = element;
                }

                if (currentElement && rootElement) {
                    targets.delete(currentElement);

                    while (currentElement.parentElement) {
                        if (currentElement.parentElement === rootElement) {
                            break;
                        }

                        checkedNodes.delete(currentElement.parentElement);
                        currentElement = currentElement.parentElement;
                    }
                    break;
                }
            }
        }
    });

    targets.forEach(target => document.body.contains(target) && intersectionObserver.observe(target as HTMLElement));

    targets.size > 0 && translateInViewPortParagraphs();
});

const startObserving = () => {
    if (!translateDynamicContent) {
        return;
    }

    observer.observe(document.body, {
        characterData: true,
        childList: true,
        subtree: true
    });
};

const stopObserving = () => {
    observer.disconnect();
};

const intersectionObserver = new IntersectionObserver((entries) => {
    let doTranslate = false;

    entries.forEach((entry) => {
        if (!entry.isIntersecting) { return; }

        const target = entry.target as HTMLElement;

        intersectionObserver.unobserve(target);

        document.body.contains(target) && getAllParagraph(target);

        doTranslate = true;
    });

    doTranslate && translateInViewPortParagraphs();
});

const newPageTranslateItem = (text: string, textNodes: Text[], codeTexts: PageTranslateItemEnity['codeTexts']) => {
    const searchIndex = text.search(/[^\s]/);

    const range = document.createRange();
    range.selectNode(textNodes[0]);

    itemMapIndex += 1;

    const item: PageTranslateItemEnity = {
        prefix: text.substring(0, searchIndex),
        text: text.substring(searchIndex).replace('\n', ' '),
        codeTexts,
        originalText: textNodes.reduce((total, textNode, index) => (`${total}${codeTexts.at(index)?.join('') ?? ''}${textNode.nodeValue ?? ''}`), ''),
        textNodes,
        fontsNodes: [],
        range,
        status: 'init',
        mapIndex: itemMapIndex
    };

    waitingList.add(item);

    pageTranslateItemMap[itemMapIndex] = item;
};

const getAllParagraph = (element: HTMLElement) => {
    let texts: Text[] = [];
    let codeTexts: PageTranslateItemEnity['codeTexts'] = [];
    let nodeStack: { node: Node; index: number; isInline: boolean; }[] = [{ node: element, index: 0, isInline: getComputedStyle(element).display === 'inline' }];
    let currentNode = nodeStack.shift();

    const nextParagraph = () => {
        const text = texts.map(v => v.nodeValue ?? '').join('');

        text.replace(/[\P{L}]/ug, '') && newPageTranslateItem(text, texts, codeTexts);

        texts = [];
        codeTexts = [];
    };

    while (currentNode) {
        let { index } = currentNode;

        for (; index < currentNode.node.childNodes.length; index++) {
            const node = currentNode.node.childNodes[index];

            if (checkedNodes.has(node)) {
                continue;
            }

            checkedNodes.add(node);

            if (ignoredTags.has(node.nodeName)) {
                nextParagraph();
                continue;
            }

            if (skippedTags.has(node.nodeName)) {
                if (node.nodeName === 'CODE' && node.textContent) {
                    const item = codeTexts[texts.length];
                    const codeText = `"${node.textContent}"`;
                    if (item) {
                        item.push(codeText);
                    }
                    else {
                        codeTexts[texts.length] = [codeText];
                    }
                }
                continue;
            }

            if (node.nodeName === '#text') {
                if (node.nodeValue?.trim()) {
                    texts.push(node as Text);
                }
                continue;
            }

            if ((node as HTMLElement).classList.contains('notranslate')) {
                nextParagraph();
                continue;
            }

            if ((node as HTMLElement).isContentEditable) {
                nextParagraph();
                continue;
            }

            const nodeStyleDisplay = getComputedStyle(node as HTMLElement).display;

            if (nodeStyleDisplay === 'none') {
                intersectionObserver.observe(node as HTMLElement);

                nextParagraph();
                continue;
            }

            let isInline = nodeStyleDisplay === 'inline';

            if (node.nodeName === 'PRE') {
                node.childNodes.forEach((v) => {
                    if (v.nodeName === '#text') {
                        const matchArray =  v.nodeValue?.match(/\n*[^\n]+/g)
                        if (matchArray) {
                            matchArray.forEach(match => node.insertBefore(document.createTextNode(match), v));

                            node.removeChild(v);
                        }
                    }
                });

                isInline = false;
            }

            nodeStack.unshift({ node, index: 0, isInline }, { ...currentNode, index: index + 1 });

            const shadowRoot = (node as HTMLElement).shadowRoot;
            if (shadowRoot) {
                isInline = false;

                nodeStack.unshift({ node: shadowRoot, index: 0, isInline });
            }

            if (!isInline) {
                nextParagraph();
            }

            break;
        }

        if (index >= currentNode.node.childNodes.length && !currentNode.isInline) {
            nextParagraph();
        }

        currentNode = nodeStack.shift();
    }

    nextParagraph();
};

export const startWebPageTranslating = ({ element, translateSource, targetLanguage, enhancement, onError, translateDynamicContent: translateDC }: {
    element: HTMLElement;
    translateSource: string;
    targetLanguage: string;
    enhancement: DisplayModeEnhancement;
    translateDynamicContent: boolean;
    onError?: (errorReason: string) => void;
}) => {
    if (startFlag === closeFlag) { return false; }

    waitingList = new Set();
    updatedList = new Set();
    checkedNodes = new WeakSet();

    pendingMap = new Map();

    translateDynamicContent = translateDC;

    errorCallback = onError;

    source = translateSource;
    language = targetLanguage;
    if (language !== resultCacheLanguage || source !== resultCacheSource) {
        cacheMap = new Map();
        resultCacheLanguage = language;
        resultCacheSource = source;
    }

    displayModeEnhancement = enhancement;

    ++startFlag;

    getAllParagraph(element);

    translateInViewPortParagraphs();

    window.addEventListener('scroll', onWindowScroll, true);

    if ((wayOfFontsDisplaying === 0 && displayModeEnhancement.o_Hovering) || (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering)) {
        window.addEventListener('mousemove', onWindowMouseMove);
    }

    startObserving();

    return true;
};

const onWindowScroll = () => {
    translateInViewPortParagraphs();
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
                    panelElement.style.zIndex = '2147483647';
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

                const currentItem = pageTranslateItemMap[displayingItem];

                if (wayOfFontsDisplaying === 0) {
                    titleElement.innerText = getMessage('optionsTranslation');
                    contentElement.innerText = currentItem.translation ?? currentItem.fontsNodes.reduce((t, [,, v]) => (t + v.innerText), '');
                    currentItem.fontsNodes.forEach(([v]) => {
                        v.style.backgroundColor = '#c9d7f1';
                        v.style.boxShadow = '2px 2px 4px #9999aa';
                    });
                }
                else if (wayOfFontsDisplaying === 2) {
                    titleElement.innerText = getMessage('optionsOriginalText');
                    contentElement.innerText = currentItem.originalText;
                    currentItem.fontsNodes.forEach(([,, v]) => {
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

    stopObserving();

    intersectionObserver.disconnect();

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

    waitingList.clear();
    updatedList.clear();

    pendingMap.clear();

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

const translateInViewPortParagraphs = delay(() => {
    const nextTranslateList: PageTranslateItemEnity[] = [];

    const minViewPort = -500;
    const maxViewPort = window.innerHeight + 500;

    waitingList.forEach((item) => {
        if (!document.body.contains(item.textNodes[0])) {
            waitingList.delete(item);
            return;
        }

        const { top } = item.range.getBoundingClientRect();

        if (top >= minViewPort && top <= maxViewPort) {
            updatedList.add(item);
            waitingList.delete(item);
            nextTranslateList.push(item);
        }
    });

    startProcessing(nextTranslateList);
}, 500);

const feedDataToPageTranslateItem = (pageTranslateItem: PageTranslateItemEnity, result: WebpageTranslateResult) => {
    stopObserving();

    pageTranslateItem.result = result;
    pageTranslateItem.translation = result.translations.reduce((total, value, index) => (`${total}${pageTranslateItem.codeTexts.at(index)?.join('') ?? ''}${value}`), '');
    const comparisons = preprocessComparisons(pageTranslateItem.result, pageTranslateItem.translation);
    pageTranslateItem.status = 'finished';
    pageTranslateItem.textNodes.forEach((textNode, i) => {
        if (!textNode.parentElement || typeof pageTranslateItem.result?.translations[i] !== 'string') { return; }

        const fonts = insertResultAndWrapOriginalTextNode(textNode, pageTranslateItem.mapIndex, pageTranslateItem.result.translations[i], comparisons[i]);
        fonts && pageTranslateItem.fontsNodes.push(fonts);
    });

    startObserving();
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

        const cachedResult = cacheMap.get(key);
        if (cachedResult) {
            feedDataToPageTranslateItem(pageTranslateItem, cachedResult);
            return;
        }

        const pendingItemSet = pendingMap.get(key);
        if (pendingItemSet) {
            pendingItemSet.add(pageTranslateItem);
            return;
        }
        else {
            pendingMap.set(key, new Set([pageTranslateItem]));
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

    if (translateList.length === 1 && translateList[0].pageTranslateList.length === 0) { return []; }

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

            result.forEach((translation, index) => {
                const key = keys[index];
                cacheMap.set(key, translation);
                pendingMap.get(key)?.forEach(item => feedDataToPageTranslateItem(item, translation));
            });
        }).catch((reason) => {
            keys.forEach(key => pendingMap.get(key)?.forEach(item => item.status = 'error'));
            errorCallback?.(reason.code ?? reason.message ?? 'Error: Unknown Error.');
        }).finally(() => {
            keys.forEach(key => pendingMap.delete(key));
        });

        keys.forEach(key => pendingMap.get(key)?.forEach(item => item.status = 'loading'));
    });
};

export const errorRetry = () => {
    const nextTranslateList = [...updatedList].filter(v => v.status === 'error');

    if (nextTranslateList.length === 0) { return; }

    startProcessing(nextTranslateList);
};

const preprocessComparisons = (webpageTranslateResult: WebpageTranslateResult, translation: string) => {
    let comparisons = webpageTranslateResult.comparisons ?? webpageTranslateResult.translations;

    if (displayModeEnhancement.oAndT_NonDiscrete) {
        const length = webpageTranslateResult.translations.length;
        comparisons = new Array(length).fill(null);
        comparisons[length - 1] = translation;
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