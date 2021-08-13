export const TRANSLATE_BUTTON_TRANSLATE = 'TRANSLATE_BUTTON_TRANSLATE';
export const TRANSLATE_BUTTON_LISTEN = 'TRANSLATE_BUTTON_LISTEN';
export const TRANSLATE_BUTTON_COPY = 'TRANSLATE_BUTTON_COPY';

export const defaultTranslateButtons = [TRANSLATE_BUTTON_TRANSLATE];

type TranslateButtonContext = {
    [key: string]: { type: 'icon', iconName: string }
};

export const translateButtonContext: TranslateButtonContext = {
    TRANSLATE_BUTTON_TRANSLATE: { type: 'icon', iconName: '#icon-MdTranslate' },
    TRANSLATE_BUTTON_LISTEN: { type: 'icon', iconName: '#icon-GoUnmute' },
    TRANSLATE_BUTTON_COPY: { type: 'icon', iconName: '#icon-copy' }
};