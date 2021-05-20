export const OPEN_THIS_PAGE_WITH_PDF_VIEWER = 'OPEN_THIS_PAGE_WITH_PDF_VIEWER';
export const OPEN_SEPARATE_WINDOW = 'OPEN_SEPARATE_WINDOW';
export const TRANSLATE_SELECTION_TEXT = 'TRANSLATE_SELECTION_TEXT';
export const LISTEN_SELECTION_TEXT = 'LISTEN_SELECTION_TEXT';

export const defaultContextMenus = [
    { id: TRANSLATE_SELECTION_TEXT, enabled: true },
    { id: LISTEN_SELECTION_TEXT, enabled: false },
    { id: OPEN_SEPARATE_WINDOW, enabled: false },
    { id: OPEN_THIS_PAGE_WITH_PDF_VIEWER, enabled: false }
];

export const contextMenusContexts = {
    OPEN_THIS_PAGE_WITH_PDF_VIEWER: ['link', 'page'],
    OPEN_SEPARATE_WINDOW: ['page'],
    TRANSLATE_SELECTION_TEXT: ['selection'],
    LISTEN_SELECTION_TEXT: ['selection']
};