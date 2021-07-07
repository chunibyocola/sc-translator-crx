type ConfirmedInsertEnity = {
    selectionRange: null | Range;
    translateId: number;
    sourceText: string;
    inserted: boolean;
    insertedNode: null | HTMLElement;
    translateSource: string;
};
const initConfirmedInsertEnity: ConfirmedInsertEnity = {
    selectionRange: null,
    translateId: 0,
    sourceText: '',
    inserted: false,
    insertedNode: null,
    translateSource: ''
};

let confirmed = false;
let confirmedInsertEnity = { ...initConfirmedInsertEnity };
let newestInsertEnity: Pick<ConfirmedInsertEnity, 'sourceText' | 'selectionRange'> = {
    sourceText: '',
    selectionRange: null
};

export const setSelectionRange = (range: Range, text: string) => {
    newestInsertEnity.selectionRange = range;
    newestInsertEnity.sourceText = text;
};

export const getInsertConfirmed = (text: string, translateId: number) => {
    if (!text || !(text === newestInsertEnity.sourceText || text === confirmedInsertEnity.sourceText) || !translateId) {
        confirmed = false;
        return false;
    }

    confirmed = true;
    if (text === confirmedInsertEnity.sourceText) {
        confirmedInsertEnity.translateId = translateId;
    }
    else {
        confirmedInsertEnity = { ...initConfirmedInsertEnity, ...newestInsertEnity, translateId, inserted: false, sourceText: text };
    }

    return true;
};

const createInsertNode = (text: string) => {
    let insertNode = document.createElement("span");
    insertNode.appendChild(document.createTextNode(text));
    insertNode.style.margin = '0 5px'
    insertNode.style.userSelect = 'none';
    return insertNode;
};

export const insertResultToggle = (translateId: number, translateSource: string, result: string) => {
    if (!confirmed || translateId !== confirmedInsertEnity.translateId || !confirmedInsertEnity.selectionRange || !translateSource) { return; }

    if (confirmedInsertEnity.inserted && confirmedInsertEnity.translateSource === translateSource) {
        confirmedInsertEnity.insertedNode?.parentElement?.removeChild(confirmedInsertEnity.insertedNode);
        confirmedInsertEnity.insertedNode = null;
        confirmedInsertEnity.inserted = false;
    }
    else if (confirmedInsertEnity.selectionRange?.insertNode) {
        if (confirmedInsertEnity.inserted && confirmedInsertEnity.insertedNode) {
            confirmedInsertEnity.insertedNode?.parentElement?.removeChild(confirmedInsertEnity.insertedNode);
        }

        confirmedInsertEnity.insertedNode = createInsertNode(result);
        confirmedInsertEnity.selectionRange.insertNode(confirmedInsertEnity.insertedNode);
        confirmedInsertEnity.inserted = true;
        confirmedInsertEnity.translateSource = translateSource;
    }
};