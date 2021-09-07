export const getSelectedText = () => {
    let text = window.getSelection()?.toString() ?? '';

    text = text.trimLeft().trimRight();

    return text;
};