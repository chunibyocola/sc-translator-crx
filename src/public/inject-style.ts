import { getLocalStorage } from './chrome-call';
import { listenOptionsChange } from './options';
import { defaultStyleVars, StyleVars, StyleVarsList } from '../constants/defaultStyleVars';
import { DefaultOptions } from '../types';

let styleVarsList: StyleVarsList = [];
let styleVarsIndex = 0;
let translatePanelFontSize: number | null = null;
let style: HTMLStyleElement;

const styleVarsToStyleText = (styleVars: StyleVars) => {
    styleVars = { ...defaultStyleVars, ...styleVars };
    return (Object.keys(styleVars) as (keyof StyleVars)[]).reduce((t: string, c: keyof StyleVars) => (t + `${c}:${styleVars[c]};`), '#sc-translator-root{') + '}';
};

const fontSizeToStyleText = (fontSize: number) => {
    return `#sc-translator-root{font-size:${fontSize}px}`;
};

const updateStyle = () => {
    // theme style
    let text = '';
    if (styleVarsIndex < styleVarsList.length && styleVarsList[styleVarsIndex] && styleVarsList[styleVarsIndex].styleVars) {
        text = styleVarsToStyleText(styleVarsList[styleVarsIndex].styleVars);
    }
    else {
        text = styleVarsToStyleText(defaultStyleVars);
    }

    // font-size of translate panel style
    translatePanelFontSize && (text += fontSizeToStyleText(translatePanelFontSize));

    setStyleInnerText(text);
};

const setStyleInnerText = (text: string) => {
    style.innerText = text;
};

const injectStyle = (styleElement?: HTMLStyleElement) => {
    if (style) { return; }

    style = styleElement ?? document.createElement('style');
    styleElement || document.head.appendChild(style);
};

export const injectThemeStyle = (styleElement?: HTMLStyleElement) => {
    injectStyle(styleElement);

    type PickedOptions = Pick<DefaultOptions, 'styleVarsIndex' | 'styleVarsList'>;
    const keys: (keyof PickedOptions)[] = ['styleVarsList', 'styleVarsIndex'];
    getLocalStorage<PickedOptions>(keys, (storage) => {
        styleVarsList = storage.styleVarsList;
        styleVarsIndex = storage.styleVarsIndex;
        updateStyle();
    });
    listenOptionsChange<PickedOptions>(keys, (changes) => {
        changes.styleVarsList !== undefined && (styleVarsList = changes.styleVarsList);
        changes.styleVarsIndex !== undefined && (styleVarsIndex = changes.styleVarsIndex);
        updateStyle();
    });
};

export const injectFontSizeStyle = (styleElement?: HTMLStyleElement) => {
    injectStyle(styleElement);

    type PickedOptions = Pick<DefaultOptions, 'translatePanelFontSize'>;
    const keys: (keyof PickedOptions)[] = ['translatePanelFontSize'];
    getLocalStorage<PickedOptions>(keys, (storage) => {
        translatePanelFontSize = storage.translatePanelFontSize;
        updateStyle();
    });
    listenOptionsChange<PickedOptions>(keys, (changes) => {
        changes.translatePanelFontSize !== undefined && (translatePanelFontSize = changes.translatePanelFontSize);
        updateStyle();
    });
};