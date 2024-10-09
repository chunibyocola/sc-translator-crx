export const getSelectedText = () => {
    let text = window.getSelection()?.toString() ?? '';

    text = text.trimStart().trimEnd();

    return text;
};