import scOptions from '../../public/sc-options';
import { sendGetAllCollectedText, sendGetCollectedByText } from '../../public/send';
import { getIsEnabled } from '../../public/utils';

let collectionTexts: string[] = [];
let rangeSet: Set<Range> = new Set();
const checkedTextNodeSet: WeakSet<Text> = new WeakSet();
const ignoredTagSet = new Set(['canvas', 'br', 'hr', 'svg', 'img', 'script', 'link', 'style', 'input', 'textarea']);
let collectedTextMap = new Map<string, string>();

const getTextNodes = (root: Element | ShadowRoot) => {
    const textNodeSet: Set<Text> = new Set();

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT + NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
        if (ignoredTagSet.has(node.nodeName.toLowerCase())) { return NodeFilter.FILTER_REJECT; }
        return NodeFilter.FILTER_ACCEPT;
    } });

    for (let currentNode: Node | null = walker.currentNode; currentNode; currentNode = walker.nextNode()) {
        if (currentNode.nodeName === '#text') {
            textNodeSet.add(currentNode as Text);
        }

        const shadowRoot = (currentNode as Element).shadowRoot;
        if (shadowRoot) {
            highlight(getTextNodes(shadowRoot));

            observer.observe(shadowRoot, {
                characterData: true,
                childList: true,
                subtree: true
            });
        }
    }

    return [...textNodeSet];
};

const highlight = (textNodes: Text[]) => {
    const nextRangeSet: Set<Range> = new Set();

    textNodes.forEach((textNode) => {
        if (checkedTextNodeSet.has(textNode)) { return; }

        checkedTextNodeSet.add(textNode);

        collectionTexts.forEach((text) => {
            const nodeValue = textNode.nodeValue?.toLowerCase();

            if (!nodeValue) { return; }

            let position = 0;
            let index = nodeValue.indexOf(text, position);

            while (index !== -1) {
                const range = new Range();

                range.setStart(textNode, index);
                range.setEnd(textNode, index + text.length);

                nextRangeSet.add(range);

                position += Math.max(text.length + index, 1);
                index = nodeValue.indexOf(text, position);
            }
        });
    });

    if (nextRangeSet.size === 0) { return; }

    [...rangeSet].forEach(range => range.collapsed && rangeSet.delete(range));

    rangeSet = rangeSet.union(nextRangeSet);

    const highlight = new Highlight(...rangeSet);
    CSS.highlights.set('sc-highlight-text', highlight);
};

const observer = new MutationObserver((records) => {
    records.forEach(({ type, target, addedNodes }) => {
        if (type === 'characterData') {
            highlight([target as Text]);
        }

        if (type === 'childList' && addedNodes.length > 0) {
            highlight(getTextNodes(target as Element));
        }
    });
});

export const initHighlight = () => {
    const { translateBlackListMode, translateHostList, highlightCollectedText, hoverHighlighted } = scOptions.getInit();
    if (!highlightCollectedText || !getIsEnabled(window.location.host, translateHostList, translateBlackListMode) || !('Highlight' in self)) { return; }

    sendGetAllCollectedText().then((texts) => {
        if ('code' in texts) { return; }

        observer.observe(document.body, {
            characterData: true,
            childList: true,
            subtree: true
        });

        collectedTextMap = new Map(texts.map(text => ([text.toLowerCase(), text])));
        collectionTexts = texts.map(text => text.toLowerCase());

        const style = document.createElement('style');
        document.head.appendChild(style);
        style.innerText = '::highlight(sc-highlight-text){background-color:#C095EE;color:#E3FFFE;}';

        highlight(getTextNodes(document.body));

        if (hoverHighlighted) {
            window.addEventListener('mousemove', onMouseMove);
        }
    }).catch();
};

const throttle = (fn: (...args: any[]) => void, delay: number) => {
    let timeout: number | null = null;
    return (...args: any[]) => {
        if (timeout) { return; }
        fn(...args);
        timeout = setTimeout(() => {
            timeout = null;
        }, delay);
    };
};

let currentRange: Range | null = null;
let showPanelTimeout: number | null = null;
let hidePanelTimeout: number | null = null;
const panel = document.createElement('div');
panel.style.position = 'fixed';
panel.style.width = '400px';
panel.style.height = '200px';
panel.style.backgroundColor = '#ffffff';
panel.style.display = 'none';
panel.style.padding = '10px 14px';
panel.style.fontSize = '14px';
panel.style.boxShadow = 'rgb(0 0 0 / 20%) 0px 0px 15px';
panel.style.zIndex = '2147483647';
panel.style.whiteSpace = 'pre-wrap';
panel.style.overflowY = 'auto';
panel.style.borderRadius = '4px';
document.documentElement.append(panel);

const clearAllTimeout = () => {
    showPanelTimeout && clearTimeout(showPanelTimeout);
    hidePanelTimeout && clearTimeout(hidePanelTimeout);
    showPanelTimeout = null;
    hidePanelTimeout = null;
};

const onPanelMouseMove = (e: MouseEvent) => {
    clearAllTimeout();
    e.stopPropagation();
};

const showPanel = (x: number, y: number, text: string) => {
    clearAllTimeout();

    showPanelTimeout = setTimeout(() => {
        panel.style.left = `${x}px`;
        panel.style.top = `${y}px`;
        panel.style.display = 'block';
        panel.addEventListener('mousemove', onPanelMouseMove);

        text = collectedTextMap.get(text.toLowerCase()) ?? '';

        sendGetCollectedByText(text).then((res) => {
            if ('code' in res) {
                panel.innerText = `(${res.code})`;
                return;
            }

            let result = '';
            res.translations.forEach(({ translateRequest }) => {
                if (translateRequest.status !== 'finished') { return; }

                result += translateRequest.result.result.join('\n');

                if (translateRequest.result.dict) {
                    result += '\n\n' + translateRequest.result.dict.join('\n');
                }
            });

            if (!result) {
                result = '(Empty)';
            }

            panel.innerText = result;
        });
    }, 1000);
};

const hidePanel = () => {
    currentRange = null;

    if (hidePanelTimeout) {return; }

    clearAllTimeout();

    hidePanelTimeout = setTimeout(() => {
        panel.style.display = 'none';
        panel.removeEventListener('mousemove', onPanelMouseMove);
    }, 500);
};

const onMouseMove = throttle((e: MouseEvent) => {
    const { clientX, clientY } = e;

    const range = [...rangeSet].find((range) => {
        return [...range.getClientRects()].find(({ left, right, top, bottom }) => {
            return left <= clientX && clientX <= right && top <= clientY && clientY <= bottom;
        });
    });

    if (currentRange === range) {
         return;
    }
    else if (range) {
        clearAllTimeout();

        currentRange = range;
        const left = Math.min(window.innerWidth - 10 - 400, clientX + 10);
        const top = Math.min(window.innerHeight - 10 - 200, clientY + 10);
        showPanel(left, top, range.toString());
    }
    else if (currentRange) {
        hidePanel();
    }
    else if (!range && panel.style.display !== 'none') {
        hidePanel();
    }
}, 50);