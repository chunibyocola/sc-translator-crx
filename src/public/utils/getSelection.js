let lastSelectionText = '';
let selecting = false;

export const setSelecting = () => selecting = true;

const getSelection = (selectCb, unselectCb) => {
    window.onmouseup = (e) => {
        setTimeout(() => {
            const text = getSelectedText();

            if (!text || text === lastSelectionText) return;

            lastSelectionText = text;
            selecting = true;
            selectCb({
                pos: {x: e.clientX, y: e.clientY},
                text
            });
        }, 0);
        
    };
    window.onmousedown = () => {
        if (selecting) {
            lastSelectionText = '';
            selecting = false;
            unselectCb();
        }
    }
};

const getSelectedText = () => {
    let text = '';

    if (window.getSelection) text = window.getSelection().toString();
    else if (document.selection) text = document.selection.createRange().text;

    text = text.trimLeft().trimRight();
    if (text.replace(/\n|[0-9]|•|\.|\+|\(|\)|\s/g, '') === '') return '';

    return text;
};

export default getSelection;