import { GOOGLE_COM, MICROSOFT_COM } from '../../constants/translateSource';
import { ComparisonCustomization, DisplayModeEnhancement } from '../../types';
import { getMessage } from '../i18n';
import { translate as googleWebTranslate } from './google/translate';
import { translate as microsoftWebTranslate } from './microsoft/translate';
import { translate as customWebTranslate } from './custom/translate';
import { getError } from '../translate/utils';
import { sendGetPageTranslationCache, sendSetPageTranslationCache } from '../send';

export type WebpageTranslateResult = {
    translations: string[];
    comparisons?: string[];
    detectedLanguage?: string;
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
    pNode?: HTMLParagraphElement;
    preNewLine?: boolean;
};


// 0: oringinal TextNode only
// 1: oringinal TextNode and result TextNode
// 2: result TextNode only
let wayOfFontsDisplaying: number = 1;

let waitingList: Set<PageTranslateItemEnity> = new Set();
let updatedList: Set<PageTranslateItemEnity> = new Set();

const ignoredTagsArr = ['canvas', 'br', 'hr', 'svg', 'img', 'script', 'link', 'style', 'input', 'textarea', 'font'];
const skippedTagsArr = ['code', '#comment'];
const ignoredTags = new Set(ignoredTagsArr.concat(ignoredTagsArr.map(v => v.toUpperCase())));
const skippedTags = new Set(skippedTagsArr.concat(skippedTagsArr.map(v => v.toUpperCase())));

let pendingMap: Map<string, Set<PageTranslateItemEnity>> = new Map();
let cacheMap: Map<string, WebpageTranslateResult> = new Map();

let resultCacheLanguage = '';
let resultCacheSource = '';

let startFlag = 0;
let closeFlag = 1;

let requestingNum = 0;

let source = '';
let language = '';

let errorCallback: ((errorReason: string) => void) | undefined;
let requestStartCallback: (() => void) | undefined;
let requestFinishCallback: (() => void) | undefined;

let displayModeEnhancement: DisplayModeEnhancement = {
    o_Hovering: false,
    oAndT_Underline: false,
    oAndT_NonDiscrete: false,
    oAndT_paragraphWrap: false,
    oAndT_hideSameLanguage: false,
    t_Hovering: false,
    t_hoveringWithKeyPressing: false
};

let comparisonCustomization: ComparisonCustomization = {
    color: 'currentcolor',
    underlineColor: 'rgba(144,236,233,1)',
    underlineStyle: 'solid'
};

let enablePageTranslationCache = false;

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

let translateIframeContent = false;

let observeRootSet: Set<HTMLElement> = new Set();

const observer = new MutationObserver((records) => {
    const noTranslate = (element: Element | null) => {
        if (!element?.isConnected) {
            return true;
        }

        const root = element.getRootNode({ composed: true });
        if (root.nodeName !== '#document') {
            return true;
        }
        const rootBody = (root as Document).body;

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
            if (element === rootBody) {
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
            [target, nextTarget].forEach(node => node && checkedNodes.delete(node));
        }

        if (type === 'childList' && addedNodes.length > 0) {
            nextTarget = target as Element;
            [target, ...addedNodes].forEach(node => checkedNodes.delete(node));
        }

        if (specifyConfig.excludeMode && nextTarget) {
            if (nextTarget.matches(specifyConfig.excludeMachesSelectors)) {
                checkedNodes.add(nextTarget);
                return;
            }
        }

        if (specifyConfig.includeMode && nextTarget) {
            if (nextTarget.matches(specifyConfig.includeMachesSelectors)) {
                targets.add(nextTarget);
            }
            else {
                let excludedElements: Set<Element> = new Set();
                if (specifyConfig.excludeMode) {
                    excludedElements = new Set([...nextTarget.querySelectorAll(specifyConfig.excludeSelectors)]);
                }
                nextTarget.querySelectorAll(specifyConfig.includeSelectors).forEach(elt => !excludedElements.has(elt) && targets.add(elt));
            }

            return;
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

    if (specifyConfig.excludeMode) {
        targets.forEach(target => target.querySelectorAll(specifyConfig.excludeSelectors).forEach(elt => checkedNodes.add(elt)));
    }

    targets.forEach(target => target.isConnected && intersectionObserver.observe(target));

    targets.size > 0 && translateInViewPortParagraphs();
});

const startObserving = () => {
    if (!translateDynamicContent) {
        return;
    }

    observeRootSet.forEach(root => observer.observe(root, {
        characterData: true,
        childList: true,
        subtree: true
    }));
};

const addObservationTarget = (target: HTMLElement) => {
    if (!translateDynamicContent) {
        return;
    }

    if (observeRootSet.has(target)) {
        return;
    }

    observeRootSet.add(target);

    observer.observe(target, {
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

        target.isConnected && getAllParagraph(target);

        doTranslate = true;
    });

    doTranslate && translateInViewPortParagraphs();
});

let ctrlKeyPressing = false;
const onKeyDown: (ev: KeyboardEvent) => any = e => e.key === 'Control' && !ctrlKeyPressing && (ctrlKeyPressing = true);
const onKeyUp: (ev: KeyboardEvent) => any = e => e.key === 'Control' && ctrlKeyPressing && (ctrlKeyPressing = false);
const startCtrlKeyPressingListener = () => {
    observeRootSet.forEach((root) => {
        root.ownerDocument.defaultView?.addEventListener('keydown', onKeyDown);
        root.ownerDocument.defaultView?.addEventListener('keyup', onKeyUp);
    });
};
const stopCtrlKeyPressingListener = () => {
    observeRootSet.forEach((root) => {
        root.ownerDocument.defaultView?.removeEventListener('keydown', onKeyDown);
        root.ownerDocument.defaultView?.removeEventListener('keyup', onKeyUp);
    });
};

export type SpecifyContentConfig = {
    includeMode: boolean;
    includeSelectors: string;
    includeMachesSelectors: string;
    excludeMode: boolean;
    excludeSelectors: string;
    excludeMachesSelectors: string;
};
let specifyConfig: SpecifyContentConfig = {
    includeMode: false,
    includeSelectors: '',
    includeMachesSelectors: '',
    excludeMode: false,
    excludeSelectors: '',
    excludeMachesSelectors: ''
};

const newPageTranslateItem = (text: string, textNodes: Text[], codeTexts: PageTranslateItemEnity['codeTexts'], pNode?: HTMLParagraphElement) => {
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
        mapIndex: itemMapIndex,
        pNode,
        preNewLine: !pNode && textNodes.every(textNode => Object.hasOwn(textNode, '_ScInsidePreTextNode'))
    };

    waitingList.add(item);

    pageTranslateItemMap[itemMapIndex] = item;
};

const getAllParagraph = (element: HTMLElement) => {
    let texts: Text[] = [];
    let codeTexts: PageTranslateItemEnity['codeTexts'] = [];
    let nodeStack: { node: Node; index: number; isInline: boolean; }[] = [{ node: element, index: 0, isInline: getComputedStyle(element).display === 'inline' }];
    let currentNode = nodeStack.shift();

    const nextParagraph = (pNode?: HTMLParagraphElement) => {
        const text = texts.map(v => v.nodeValue ?? '').join('');

        text.replace(/[\P{L}]/ug, '') && newPageTranslateItem(text, texts, codeTexts, pNode);

        texts = [];
        codeTexts = [];
    };

    if (element.shadowRoot) {
        currentNode = { node: element.shadowRoot, index: 0, isInline: false };
    }

    if (element.nodeName === 'IFRAME' && translateIframeContent) {
        try {
            if (new URL((element as HTMLIFrameElement).src).host !== location.host) {
                return;
            }
        }
        catch {
            return;
        }

        const contentBody = (element as HTMLIFrameElement).contentDocument?.body;

        if (contentBody) {
            currentNode = { node: contentBody, index: 0, isInline: false };

            addObservationTarget(contentBody);

            if ((wayOfFontsDisplaying === 0 && displayModeEnhancement.o_Hovering) || (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering)) {
                contentBody.ownerDocument.defaultView?.addEventListener('mousemove', onWindowMouseMove);
            }

            displayModeEnhancement.t_hoveringWithKeyPressing && startCtrlKeyPressingListener();

            contentBody.ownerDocument.defaultView?.addEventListener('scroll', onWindowScroll, true);
        }
        else {
            return;
        }
    }

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
                if (!node.nodeValue) { continue; }

                if (Object.hasOwn(node, '_ScInsidePreLineBreak')) {
                    nextParagraph();
                    continue;
                }

                if (node.nodeValue.trim()) {
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

            if (node.nodeName === 'IFRAME') {
                intersectionObserver.observe(node as HTMLIFrameElement);

                nextParagraph();
                continue;
            }

            if (displayModeEnhancement.oAndT_paragraphWrap && node.nodeName === 'P' && !(node.nextSibling?.nodeName === 'P' && Object.hasOwn(node.nextSibling, '_ScWebpageTranslationKey'))) {
                nextParagraph();

                const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_ALL, {
                    acceptNode: (node) => {
                        if (ignoredTags.has(node.nodeName) || node.nodeName === '#comment') { return NodeFilter.FILTER_REJECT; }
                        
                        return NodeFilter.FILTER_ACCEPT;
                    }
                });

                let currentNode: null | Node;
                let codeElement: null | HTMLElement = null;

                for (currentNode = treeWalker.currentNode; currentNode; currentNode = treeWalker.nextNode()) {
                    const { nodeName } = currentNode;

                    if (checkedNodes.has(currentNode)) { continue; }

                    checkedNodes.add(currentNode);

                    if (nodeName === 'CODE') {
                        codeElement = currentNode as HTMLElement;
                    }
                    if (nodeName === '#text' && currentNode.nodeValue?.trim()) {
                        if (codeElement && codeElement.contains(currentNode)) {
                            const item = codeTexts[texts.length];
                            const codeText = `"${currentNode.textContent}"`;
                            if (item) {
                                item.push(codeText);
                            }
                            else {
                                codeTexts[texts.length] = [codeText];
                            }
                        }
                        else {
                            codeElement = null;
                            texts.push(currentNode as Text);
                        }
                    }
                }

                nextParagraph(node as HTMLParagraphElement);
                continue;
            }

            let isInline = nodeStyleDisplay === 'inline';

            if (getComputedStyle(node as HTMLElement).whiteSpace.includes('pre') && node.parentElement && !getComputedStyle(node.parentElement).whiteSpace.includes('pre')) {
                const textNodes: Text[] = [];
                const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
                let nextText: Text | null = treeWalker.nextNode() as Text;
                while (nextText) {
                    textNodes.push(nextText);
                    nextText = treeWalker.nextNode() as Text;
                }

                stopObserving();

                textNodes.forEach((textNode) => {
                    if (!textNode?.parentElement) { return; }

                    const splited = textNode.nodeValue?.split('\n');

                    if (!splited) { return; }

                    for (let i = 0; i < splited.length; i++) {
                        const text = splited[i];

                        if (i !== 0) {
                            const lineBreak = document.createTextNode('\n');
                            Object.assign(lineBreak, { _ScInsidePreLineBreak: true });
                            textNode.parentElement.insertBefore(lineBreak, textNode);
                        }

                        if (!text) { continue; }

                        const nextTextNode = document.createTextNode(text);

                        if (displayModeEnhancement.oAndT_paragraphWrap) {
                            Object.assign(nextTextNode, { _ScInsidePreTextNode: true });
                        }

                        textNode.parentElement.insertBefore(nextTextNode, textNode);
                    }

                    textNode.parentElement.removeChild(textNode);
                });

                startObserving();

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

export const startWebPageTranslating = ({
    element,
    translateSource,
    targetLanguage,
    enhancement,
    translateDynamicContent: translateDC,
    translateIframeContent: translateIC,
    customization,
    enableCache,
    specifySelectors,
    onError,
    onRequestStart,
    onRequestFinish
}: {
    element: HTMLElement;
    translateSource: string;
    targetLanguage: string;
    enhancement: DisplayModeEnhancement;
    translateDynamicContent: boolean;
    translateIframeContent: boolean;
    customization: ComparisonCustomization;
    enableCache: boolean;
    specifySelectors: { includeSelectors: string; excludeSelectors: string; };
    onError?: (errorReason: string) => void;
    onRequestStart?: () => void;
    onRequestFinish?: () => void;
}) => {
    if (startFlag === closeFlag) { return false; }

    waitingList = new Set();
    updatedList = new Set();
    checkedNodes = new WeakSet();

    pendingMap = new Map();

    observeRootSet = new Set([document.body]);

    translateDynamicContent = translateDC;

    translateIframeContent = translateIC;

    errorCallback = onError;
    requestStartCallback = onRequestStart;
    requestFinishCallback = onRequestFinish;

    source = translateSource;
    language = targetLanguage;
    if (language !== resultCacheLanguage || source !== resultCacheSource) {
        cacheMap = new Map();
        resultCacheLanguage = language;
        resultCacheSource = source;
    }

    displayModeEnhancement = enhancement;

    comparisonCustomization = customization;

    enablePageTranslationCache = enableCache;

    const { includeSelectors, excludeSelectors } = specifySelectors;
    if (includeSelectors) {
        specifyConfig.includeMode = true;
        specifyConfig.includeSelectors = includeSelectors;
        specifyConfig.includeMachesSelectors = includeSelectors + includeSelectors.split(',').reduce((t, c) => (`${t},${c} *`), '');
    }
    if (excludeSelectors) {
        specifyConfig.excludeMode = true;
        specifyConfig.excludeSelectors = excludeSelectors;
        specifyConfig.excludeMachesSelectors = excludeSelectors + excludeSelectors.split(',').reduce((t, c) => (`${t},${c} *`), '');
    }

    ++startFlag;

    let excludedElements: Set<Element> = new Set();
    if (specifyConfig.excludeMode) {
        excludedElements = new Set([...element.querySelectorAll(specifyConfig.excludeSelectors)]);
        excludedElements.forEach(elt => checkedNodes.add(elt));
    }

    if (specifyConfig.includeMode) {
        element.querySelectorAll(specifyConfig.includeSelectors).forEach(elt => !excludedElements.has(elt) && getAllParagraph(elt as HTMLElement));
    }
    else {
        getAllParagraph(element);
    }

    translateInViewPortParagraphs();

    displayModeEnhancement.t_hoveringWithKeyPressing && startCtrlKeyPressingListener();

    observeRootSet.forEach(root => root.ownerDocument.defaultView?.addEventListener('scroll', onWindowScroll, true));

    if ((wayOfFontsDisplaying === 0 && displayModeEnhancement.o_Hovering) || (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering)) {
        observeRootSet.forEach(root => root.ownerDocument.defaultView?.addEventListener('mousemove', onWindowMouseMove));
    }

    startObserving();

    return true;
};

const onWindowScroll = () => {
    translateInViewPortParagraphs();
};

const hidePanel = () => {
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
};

const onWindowMouseMove = (e: MouseEvent) => {
    const element = e.target as HTMLElement;
    const key = (element as ScWebpageTranslationElement)._ScWebpageTranslationKey;

    if (element.tagName === 'FONT' && key) {
        if (displayingItem && key === displayingItem) {
            clearAllTimeout();
        }
        else if (hoveringItem !== key) {
            if (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_hoveringWithKeyPressing && !ctrlKeyPressing) {
                if ((displayingItem || showPanelTimeout) && !hidePanelTimeout) {
                    hidePanel();
                }

                return;
            }

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

                let relativeX = e.clientX;
                let relativeY = e.clientY;
                let frameElement = element.ownerDocument.defaultView?.frameElement;
                while (frameElement) {
                    const { top: frameTop, left: frameLeft } = frameElement.getBoundingClientRect();
                    relativeX += frameLeft;
                    relativeY += frameTop;

                    frameElement = frameElement.ownerDocument.defaultView?.frameElement;
                }

                panelElement.style.left = `${Math.max(relativeX + 25 - Math.max((relativeX + 35 + width) - window.innerWidth, 0), 10)}px`;
                panelElement.style.top = `${relativeY + 15 - Math.max((relativeY + 25 + height) - window.innerHeight, 0)}px`;

                showPanelTimeout = null;
            }, 1000);
        }

        hoveringItem = key;
    }
    else if ((displayingItem || showPanelTimeout) && !hidePanelTimeout) {
        hidePanel();
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

    displayModeEnhancement.t_hoveringWithKeyPressing && stopCtrlKeyPressingListener();

    observeRootSet.forEach(root => root.ownerDocument.defaultView?.removeEventListener('scroll', onWindowScroll, true));

    observeRootSet.forEach(root => root.ownerDocument.defaultView?.removeEventListener('mousemove', onWindowMouseMove));

    observeRootSet.clear();
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
        if (!item.textNodes[0]?.isConnected) {
            waitingList.delete(item);
            return;
        }

        let { top } = item.range.getBoundingClientRect();

        const frameElement = item.textNodes[0].ownerDocument.defaultView?.frameElement;
        if (frameElement?.isConnected) {
            top += frameElement.getBoundingClientRect().top;
        }

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

    const noComparison = displayModeEnhancement.oAndT_hideSameLanguage && (result.detectedLanguage === language);

    pageTranslateItem.textNodes.forEach((textNode, i) => {
        if (!textNode.parentElement || typeof pageTranslateItem.result?.translations[i] !== 'string') { return; }

        const comparison = (noComparison || pageTranslateItem.pNode || pageTranslateItem.preNewLine) ? null : comparisons[i];

        const fonts = insertResultAndWrapOriginalTextNode(textNode, pageTranslateItem.mapIndex, pageTranslateItem.result.translations[i], comparison);
        fonts && pageTranslateItem.fontsNodes.push(fonts);
    });

    if (!noComparison) {
        if (pageTranslateItem.pNode) {
            const paragraph: ScWebpageTranslationElement = document.createElement('p');

            pageTranslateItem.pNode.parentElement?.insertBefore(paragraph, pageTranslateItem.pNode.nextSibling);

            const comparisonFont: ScWebpageTranslationElement = document.createElement('font');
            comparisonFont._ScWebpageTranslationKey = pageTranslateItem.mapIndex;
            comparisonFont.appendChild(document.createTextNode(pageTranslateItem.translation));
            comparisonFont.setAttribute('style', getComparisonStyle());

            paragraph.appendChild(comparisonFont);
            paragraph.className = pageTranslateItem.pNode.className;
            paragraph._ScWebpageTranslationKey = pageTranslateItem.mapIndex;

            pageTranslateItem.fontsNodes[pageTranslateItem.fontsNodes.length - 1][1] = paragraph;

            dealWithFontsStyle(pageTranslateItem.fontsNodes[pageTranslateItem.fontsNodes.length - 1]);
        }
        else if (pageTranslateItem.preNewLine) {
            const font: ScWebpageTranslationElement = document.createElement('font');

            const lastOriginalFont = pageTranslateItem.fontsNodes.at(-1)?.[0];
            lastOriginalFont?.parentElement?.insertBefore(font, lastOriginalFont.nextSibling);

            const comparisonFont: ScWebpageTranslationElement = document.createElement('font');
            comparisonFont._ScWebpageTranslationKey = pageTranslateItem.mapIndex;
            comparisonFont.appendChild(document.createTextNode(pageTranslateItem.translation));
            comparisonFont.setAttribute('style', getComparisonStyle());

            font.appendChild(document.createTextNode('\n'));
            font.appendChild(comparisonFont);
            font._ScWebpageTranslationKey = pageTranslateItem.mapIndex;

            pageTranslateItem.fontsNodes[pageTranslateItem.fontsNodes.length - 1][1] = font;

            dealWithFontsStyle(pageTranslateItem.fontsNodes[pageTranslateItem.fontsNodes.length - 1]);
        }
    }

    startObserving();
};

type KeyFormat = (paragraph: string[]) => string;
const getTranslateList = async (nextTranslateList: PageTranslateItemEnity[], keyFormat: KeyFormat, options = { maxParagraphCount: 100, maxTextLength: 2048 }) => {
    const keyMap: Map<string, { paragraph: string[]; }> = new Map();

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

        keyMap.set(key, { paragraph });
    });

    if (enablePageTranslationCache) {
        const result = await sendGetPageTranslationCache([...keyMap.keys()], source, '', language);
        if (!('code' in result)) {
            const resultKeys = Object.keys(result);

            resultKeys.forEach((key) => {
                const pendingItemSet = pendingMap.get(key);
                pendingItemSet?.forEach(item => feedDataToPageTranslateItem(item, result[key]));
                cacheMap.set(key, result[key]);
                keyMap.delete(key);
                pendingMap.delete(key);
            });
        }
    }

    const translateList: { keys: string[]; paragraphs: string[][]; }[] = [];

    let keys: string[] = [];
    let paragraphs: string[][] = [];
    let totalKey: string = '';

    keyMap.forEach(({ paragraph }, key) => {
        if (!pendingMap.has(key)) {
            return;
        }

        if ((totalKey.length + key.length > options.maxTextLength) || (paragraphs.length + 1 > options.maxParagraphCount)) {
            translateList.push({ keys, paragraphs });
            keys = [];
            paragraphs = [];
            totalKey = '';
        }

        paragraphs.push(paragraph);
        keys.push(key);
        totalKey += key;
    });

    if (keys.length && paragraphs.length && totalKey.trim()) {
        translateList.push({ keys, paragraphs });
    }

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

const startProcessing = async (nextTranslateList: PageTranslateItemEnity[]) => {
    const translateList = await getTranslateList(nextTranslateList, getKeyFormatFn());

    if (translateList.length === 0) { return; }

    translateProcess({
        translateList,
        beforeTranslate: keys => keys.forEach(key => pendingMap.get(key)?.forEach(item => item.status = 'loading')),
        onSuccess: (keys) => {
            keys.forEach((key) => {
                const translation = cacheMap.get(key);

                translation && pendingMap.get(key)?.forEach(item => feedDataToPageTranslateItem(item, translation))
            });
        },
        onError: keys => keys.forEach(key => pendingMap.get(key)?.forEach(item => item.status = 'error')),
        onFinally: keys => keys.forEach(key => pendingMap.delete(key))
    });
};

const translateProcess = ({ translateList, beforeTranslate, onSuccess, onError, onFinally }: {
    translateList: { keys: string[]; paragraphs: string[][]; }[];
    beforeTranslate?: (keys: string[]) => void;
    onSuccess?: (keys: string[], result: WebpageTranslateResult[]) => void;
    onError?: (keys: string[], reason: any) => void;
    onFinally?: (keys: string[]) => void;
}) => {
    let translate: WebpageTranslateFn;
    let targetLanguage = language;

    if (source === GOOGLE_COM) {
        translate = googleWebTranslate;
    }
    else if (source === MICROSOFT_COM) {
        translate = microsoftWebTranslate;
    }
    else {
        translate = customWebTranslate;
    }

    const tempCloseFlag = closeFlag;

    translateList.forEach(({ paragraphs, keys }) => {
        if (requestingNum === 0) {
            requestStartCallback?.();
        }
        requestingNum++;

        translate({ paragraphs, keys, targetLanguage }, source).then((result) => {
            // if not the same, means web page translate has been closed.
            if (tempCloseFlag !== closeFlag) { return; }

            if (keys.length !== result.length) { throw getError(`Error: "result"'s length is not the same as "paragraphs"'s.`); }

            if (enablePageTranslationCache) {
                sendSetPageTranslationCache(keys.map((key, index) => ({ key, translation: result[index] })), source, '', language);
            }

            result.forEach((translation, index) => {
                const key = keys[index];
                cacheMap.set(key, translation);
            });

            onSuccess?.(keys, result);
        }).catch((reason) => {
            if (tempCloseFlag !== closeFlag) { return; }

            onError?.(keys, reason);

            errorCallback?.(reason.code ?? reason.message ?? 'Error: Unknown Error.');
        }).finally(() => {
            if (tempCloseFlag !== closeFlag) { return; }

            onFinally?.(keys);

            requestingNum--;
            if (requestingNum === 0) {
                requestFinishCallback?.();
            }
        });

        beforeTranslate?.(keys);
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

const getComparisonStyle = () => {
    const { color, underlineColor, underlineStyle } = comparisonCustomization;
    const borderStyle = displayModeEnhancement.oAndT_Underline ? ` border-bottom: 2px ${underlineStyle} ${underlineColor}; padding: 0 2px;` : '';
    return `color: ${color};${borderStyle}`;
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

    comparisonFont?.setAttribute('style', `margin: 0 5px;${getComparisonStyle()}`);

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

    observeRootSet.forEach(root => root.ownerDocument.defaultView?.removeEventListener('mousemove', onWindowMouseMove));

    if ((wayOfFontsDisplaying === 0 && displayModeEnhancement.o_Hovering) || (wayOfFontsDisplaying === 2 && displayModeEnhancement.t_Hovering)) {
        observeRootSet.forEach(root => root.ownerDocument.defaultView?.addEventListener('mousemove', onWindowMouseMove));
    }

    updatedList.forEach((item) => {
        item.fontsNodes.forEach(dealWithFontsStyle);
    });
};

const dealWithFontsStyle = ([originalFont, comparisonFont, translationFont]: ItemFonts) => {
    switch (wayOfFontsDisplaying) {
        case 0:
            originalFont.style.setProperty('display', '');
            comparisonFont?.style.setProperty('display', 'none', 'important');
            translationFont.style.setProperty('display', 'none', 'important');
            return;
        case 1:
            originalFont.style.setProperty('display', '');
            comparisonFont?.style.setProperty('display', '');
            translationFont.style.setProperty('display', 'none', 'important');
            return;
        default:
            originalFont.style.setProperty('display', 'none', 'important');
            comparisonFont?.style.setProperty('display', 'none', 'important');
            translationFont.style.setProperty('display', '');
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