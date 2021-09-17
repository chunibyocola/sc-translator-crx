export const TRANSLATE_BUTTON_TRANSLATE = 'TRANSLATE_BUTTON_TRANSLATE';
export const TRANSLATE_BUTTON_LISTEN = 'TRANSLATE_BUTTON_LISTEN';
export const TRANSLATE_BUTTON_COPY = 'TRANSLATE_BUTTON_COPY';
export const TRANSLATE_BUTTON_TL_FIRST = 'TRANSLATE_BUTTON_TL_FIRST';
export const TRANSLATE_BUTTON_TL_SECOND = 'TRANSLATE_BUTTON_TL_SECOND';
export const TRANSLATE_BUTTON_TL_THIRD = 'TRANSLATE_BUTTON_TL_THIRD';

export const defaultTranslateButtons = [TRANSLATE_BUTTON_TRANSLATE];

type TranslateButtonContext = {
    [key: string]: { type: 'icon', iconName: string };
};

export const translateButtonContext: TranslateButtonContext = {
    TRANSLATE_BUTTON_TRANSLATE: { type: 'icon', iconName: '#icon-MdTranslate' },
    TRANSLATE_BUTTON_LISTEN: { type: 'icon', iconName: '#icon-GoUnmute' },
    TRANSLATE_BUTTON_COPY: { type: 'icon', iconName: '#icon-copy' },
    TRANSLATE_BUTTON_TL_FIRST: { type: 'icon', iconName: '#icon-A' },
    TRANSLATE_BUTTON_TL_SECOND: { type: 'icon', iconName: '#icon-B' },
    TRANSLATE_BUTTON_TL_THIRD: { type: 'icon', iconName: '#icon-C' }
};