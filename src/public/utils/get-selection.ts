export const getSelectedText = () => {
    let text = window.getSelection()?.toString() ?? '';

    text = text.trimLeft().trimRight();
    if (text.replace(/\n|[0-9]|•|\.|\+|\(|\)|\s/g, '') === '') { return ''; }

    return text;
};