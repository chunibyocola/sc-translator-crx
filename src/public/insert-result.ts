type Insertion = {
    range: Range;
    translateId: number;
    source?: string;
    text: string;
    fontNode: HTMLFontElement;
};

let insertion: Insertion | null = null;
let textRange: Pick<Insertion, 'range' | 'text'> | null = null;

export const setSelectionRange = (range: Range, text: string) => {
    textRange = { range, text };
};

const createInsertNode = () => {
    let insertNode = document.createElement('font');
    insertNode.style.margin = '0 5px';
    insertNode.style.userSelect = 'none';
    insertNode.style.padding = '0 2px';
    insertNode.style.borderBottom = '2px solid #72ECE9';
    return insertNode;
};

export const confirmInsertion = (text: string, translateId: number) => {
    if (text === insertion?.text) {
        insertion = { ...insertion, translateId };
        insertion.fontNode.remove();
        return true;
    }
    else if (text === textRange?.text) {
        insertion = { ...textRange, translateId, fontNode: createInsertNode() };
        return true;
    }
    
    return false;
};

export const insertTranslationToggle = (translateId: number, source: string, translation: string) => {
    if (translateId !== insertion?.translateId) { return; }

    if (source === insertion.source && insertion.fontNode.parentElement) {
        insertion.fontNode.remove();
    }
    else {
        insertion.fontNode.innerText = translation;
        insertion.range.insertNode(insertion.fontNode);
        insertion.source = source;
    }
};