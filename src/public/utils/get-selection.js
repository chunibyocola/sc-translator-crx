let lastSelectionText = '';

const getSelection = (selectCallback, unselectCallback) => {
    const onMouseUp = (e) => {
        setTimeout(() => {
            const text = getSelectedText();

            if (!text || lastSelectionText === text) return;
            lastSelectionText = text;

            selectCallback({
                pos: { x: e.clientX, y: e.clientY },
                text
            });
        }, 0);
        
    };
    
    const onMouseDown = () => {
        lastSelectionText = '';
        unselectCallback();
    };

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousedown', onMouseDown);
    };
};

export const getSelectedText = () => {
    let text = '';

    if (window.getSelection) text = window.getSelection().toString();
    else if (document.selection) text = document.selection.createRange().text;

    text = text.trimLeft().trimRight();
    if (text.replace(/\n|[0-9]|•|\.|\+|\(|\)|\s/g, '') === '') return '';

    return text;
};

export default getSelection;