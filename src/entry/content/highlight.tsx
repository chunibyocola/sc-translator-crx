import scOptions from '../../public/sc-options';
import { sendGetAllCollectedText } from '../../public/send';
import { getIsEnabled } from '../../public/utils';

let collectionTexts: string[] = [];
let rangeSet: Set<Range> = new Set();

const getTextNodes = (root: Element | ShadowRoot) => {
    const textNodes: Text[] = [];

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT + NodeFilter.SHOW_DOCUMENT_FRAGMENT + NodeFilter.SHOW_ELEMENT);

    for (let currentNode: Node | null = walker.currentNode; currentNode; currentNode = walker.nextNode()) {
        if (currentNode.nodeName === '#text') {
            textNodes.push(currentNode as Text);
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

    return textNodes;
};

const highlight = (textNodes: Text[]) => {
    const nextRanges: Range[] = [];

    textNodes.forEach((textNode) => {
        collectionTexts.forEach((text) => {
            const index = textNode.nodeValue?.indexOf(text) ?? -1;

            if (index === -1) { return; }

            const range = new Range();

            range.setStart(textNode, index);
            range.setEnd(textNode, index + text.length);

            nextRanges.push(range);
        });
    });

    if (nextRanges.length === 0) { return; }

    [...rangeSet.values()].forEach(range => range.collapsed && rangeSet.delete(range));

    nextRanges.forEach(range => rangeSet.add(range));

    const highlight = new Highlight(...rangeSet.values());
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
    const { translateBlackListMode, translateHostList, highlightCollectedText } = scOptions.getInit();
    if (!highlightCollectedText || !getIsEnabled(window.location.host, translateHostList, translateBlackListMode) || !('Highlight' in self)) { return; }

    sendGetAllCollectedText().then((texts) => {
        if ('code' in texts) { return; }

        observer.observe(document.body, {
            characterData: true,
            childList: true,
            subtree: true
        });

        collectionTexts = texts;

        const style = document.createElement('style');
        document.head.appendChild(style);
        style.innerText = '::highlight(sc-highlight-text){background-color:#C095EE;color:#E3FFFE;}';

        highlight(getTextNodes(document.body));
    }).catch();
};