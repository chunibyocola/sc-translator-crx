import { GOOGLE_COM } from '../../constants/translateSource';
import { translate as googleWebTranslate } from './google/translate';

type PageTranslateItemEnity = {
    prefix: string;
    text: string;
    result?: string[];
    textNodes: Text[];
    fontsNodes: [HTMLFontElement, HTMLFontElement][];
    firstTextNodeClientY: number;
    status: 'init' | 'loading' | 'error' | 'finished';
};


// 0: oringinal TextNode only
// 1: oringinal TextNode and result TextNode
// 2: result TextNode only
let wayOfFontsDisplaying: number = 1;

let waitingList: PageTranslateItemEnity[] = [];
let updatedList: PageTranslateItemEnity[] = [];

const preIgnoreTagRegExp = /CANVAS|IFRAME|BR|HR|SVG|IMG|SCRIPT|LINK|STYLE|INPUT|TEXTAREA|CODE|#comment/i;
const ignoreTagRegExp = /CANVAS|IFRAME|BR|HR|SVG|IMG|SCRIPT|LINK|STYLE|INPUT|TEXTAREA/i;
const skipTagRegExp = /CODE|#comment/i;
let minViewPort = 0;
let maxViewPort = 0;

let resultCache: { [key: string]: string[] } = {};
let resultCacheLanguage = '';

let startFlag = 0;
let closeFlag = 1;

let source = '';
let language = '';

let errorCallback: ((errorReason: string) => void) | undefined;

const newPageTranslateItem = (text: string, nodes: Node[]) => {
    const searchIndex = text.search(/[^\s]/);
    const textNodes = getTextNodesFromNodes(nodes);
    
    const range = document.createRange();
    range.selectNode(textNodes[0]);
    range.getBoundingClientRect().y
    const firstTextNodeClientY = range.getBoundingClientRect().top + window.scrollY;

    waitingList.push({
        prefix: text.substring(0, searchIndex),
        text: text.substring(searchIndex).replace('\n', ' '),
        textNodes,
        fontsNodes: [],
        firstTextNodeClientY,
        status: 'init'
    });
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
    let currentNode: { node: Node; index: number } | undefined = undefined;

    while (currentNode = nodeStack.shift()) {
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
    }
    return true;
};

const getTextNodesFromNodes = (nodes: Node[]) => {
    let textNodes: Text[] = [];
    let nodeStack: { node: Node; index: number }[] = nodes.map((v) => ({ node: v, index: 0 }));
    let currentNode: { node: Node; index: number } | undefined;

    while (currentNode = nodeStack.shift()) {
        if (currentNode.node.nodeName === '#text' && currentNode.node.nodeValue?.trimLeft()) {
            textNodes.push(currentNode.node as Text);
            continue;
        }

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

    return textNodes;
};


const getAllTextFromElement = (element: HTMLElement) => {
    let elementArr: Node[] = [];
    let text = '';
    let nodeStack: { node: Node; index: number }[] = [{ node: element, index: 0 }];
    let currentNode: { node: Node; index: number } | undefined = undefined;

    while (currentNode = nodeStack.shift()) {
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
            else if (window.getComputedStyle(node as HTMLElement).display === 'inline' && isPureInlineElement(node as HTMLElement) && (node as HTMLElement).innerText.trimLeft()) {
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

        if (elementArr.length > 0 && text.trimLeft()) {
            newPageTranslateItem(text, elementArr);
        }

        elementArr = [];
        text = '';
    }
};

export const startWebPageTranslating = (element: HTMLElement, translateSource: string, targetLanguage: string, errorCb?: (errorReason: string) => void) => {
    if (startFlag === closeFlag) { return false; }

    errorCb && (errorCallback = errorCb);

    source = translateSource;
    language = targetLanguage;
    if (language !== resultCacheLanguage) {
        resultCache = {};
        resultCacheLanguage = language;
    }

    ++startFlag;

    minViewPort = window.scrollY - 500;
    maxViewPort = window.scrollY + window.innerHeight + 500;

    getAllTextFromElement(element);

    handleDelay();

    window.addEventListener('scroll', onWindowScroll);

    return true;
};

const onWindowScroll = () => {
    if (window.scrollY - 100 < minViewPort) {
        minViewPort = window.scrollY - 500;
    }
    if (window.scrollY + window.innerHeight + 100 > maxViewPort) {
        maxViewPort = window.scrollY + window.innerHeight + 500;
    }

    handleDelay();
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

    window.removeEventListener('scroll', onWindowScroll);
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
        default: break;
    }
}, 500);

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

                const fonts = insertResultAndWrapOriginalTextNode(textNode, currentItem.result[i]);
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

    translateList.map((item) => {
        const dealWithResult = (result: string[][]) => {
            item.pageTranslateList.forEach((v, i) => {
                v.result = result[i];
                v.status = 'finished';
                v.textNodes.forEach((textNode, i) => {
                    if (!textNode.parentElement || !v.result?.[i]) { return; }
    
                    const fonts = insertResultAndWrapOriginalTextNode(textNode, v.result[i]);
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
        default: break;
    }
};

const insertResultAndWrapOriginalTextNode = (textNode: Text, result: string): [HTMLFontElement, HTMLFontElement] | void => {
    if (!textNode.parentElement) { return; }

    const originalFont = document.createElement('font');
    const resultFont = document.createElement('font');

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

    updatedList.forEach((item) => {
        item.fontsNodes.forEach(v => dealWithFontsStyle(v[0], v[1]));
    });
};

const dealWithFontsStyle = (originalFont: HTMLFontElement, resultFont: HTMLFontElement) => {
    switch (wayOfFontsDisplaying) {
        case 0:
            originalFont.setAttribute('style', '');
            resultFont.setAttribute('style', 'display: none;');
            return;
        case 1:
            originalFont.setAttribute('style', '');
            resultFont.setAttribute('style', 'margin: 0 5px;');
            return;
        default:
            originalFont.setAttribute('style', 'display: none;');
            resultFont.setAttribute('style', '');
            return;
    }
};

export const escapeText = (text: string) => {
    return text.replace(/\<|\>|\&|\"|\'/g, (match) => {
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

export const unescapeText = (text: string) => {
    return text.replace(/\&[^;]+;/g, (match) => {
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