import { getLocalStorage } from './chrome-call';
import { listenOptionsChange } from './options';
import { defaultStyleVars, StyleVars, StyleVarsList } from '../constants/defaultStyleVars';
import { DefaultOptions } from '../types';

// color vars
let styleVarsList: StyleVarsList = [];
let styleVarsIndex = 0;

let colorVarsStyle: HTMLStyleElement;

// font size
let translatePanelFontSize: number;

let fontSizeStyle: HTMLStyleElement;

// customize style
let customizeStyleText: string;

let customizeStyle: HTMLStyleElement;

const styleVarsToStyleText = (styleVars: StyleVars) => {
    styleVars = { ...defaultStyleVars, ...styleVars };
    return (Object.keys(styleVars) as (keyof StyleVars)[]).reduce((t: string, c: keyof StyleVars) => (t + `${c}:${styleVars[c]};`), '#sc-translator-root{') + '}';
};

const fontSizeToStyleText = (fontSize: number) => {
    return `#sc-translator-root{font-size:${fontSize}px}`;
};

const updateColorVarsStyleInnerText = () => {
    if (styleVarsIndex < styleVarsList.length && styleVarsList[styleVarsIndex] && styleVarsList[styleVarsIndex].styleVars) {
        colorVarsStyle.innerText = styleVarsToStyleText(styleVarsList[styleVarsIndex].styleVars);
    }
    else {
        colorVarsStyle.innerText = styleVarsToStyleText(defaultStyleVars);
    }
};

const updateFontSizeStyleInnerText = () => {
    fontSizeStyle.innerText = fontSizeToStyleText(translatePanelFontSize);
};

const updateCustomizeStyleInnerText = () => {
    customizeStyle.innerText = customizeStyleText.replaceAll('\n', ' ');
};

export const appendColorVarsStyle = (targetParent: HTMLElement | ShadowRoot) => {
    colorVarsStyle = document.createElement('style');
    targetParent.appendChild(colorVarsStyle);

    type PickedOptions = Pick<DefaultOptions, 'styleVarsIndex' | 'styleVarsList'>;
    const keys: (keyof PickedOptions)[] = ['styleVarsList', 'styleVarsIndex'];
    getLocalStorage<PickedOptions>(keys, (storage) => {
        styleVarsList = storage.styleVarsList;
        styleVarsIndex = storage.styleVarsIndex;
        updateColorVarsStyleInnerText();
    });
    listenOptionsChange<PickedOptions>(keys, (changes) => {
        changes.styleVarsList !== undefined && (styleVarsList = changes.styleVarsList);
        changes.styleVarsIndex !== undefined && (styleVarsIndex = changes.styleVarsIndex);
        updateColorVarsStyleInnerText();
    });
};

export const appendFontSizeStyle = (targetParent: HTMLElement | ShadowRoot) => {
    fontSizeStyle = document.createElement('style');
    targetParent.appendChild(fontSizeStyle);

    type PickedOptions = Pick<DefaultOptions, 'translatePanelFontSize'>;
    const keys: (keyof PickedOptions)[] = ['translatePanelFontSize'];
    getLocalStorage<PickedOptions>(keys, (storage) => {
        translatePanelFontSize = storage.translatePanelFontSize;
        updateFontSizeStyleInnerText();
    });
    listenOptionsChange<PickedOptions>(keys, (changes) => {
        changes.translatePanelFontSize !== undefined && (translatePanelFontSize = changes.translatePanelFontSize);
        updateFontSizeStyleInnerText();
    });
};

export const appendCustomizeStyle = (targetParent: HTMLElement | ShadowRoot) => {
    customizeStyle = document.createElement('style');
    targetParent.appendChild(customizeStyle);

    type PickedOptions = Pick<DefaultOptions, 'customizeStyleText'>;
    const keys: (keyof PickedOptions)[] = ['customizeStyleText'];
    getLocalStorage<PickedOptions>(keys, (storage) => {
        customizeStyleText = storage.customizeStyleText;
        updateCustomizeStyleInnerText();
    });
    listenOptionsChange<PickedOptions>(keys, (changes) => {
        changes.customizeStyleText !== undefined && (customizeStyleText = changes.customizeStyleText);
        updateCustomizeStyleInnerText();
    })
};