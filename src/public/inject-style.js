import { getLocalStorage } from './chrome-call';
import { listenOptionsChange } from './options';
import { defaultStyleVars } from '../constants/defaultStyleVars';

let styleVarsList = [];
let styleVarsIndex = 0;
let translatePanelFontSize = null;
let style;

const styleVarsToStyleText = (styleVars) => {
    styleVars = { ...defaultStyleVars, ...styleVars };
    return Object.keys(styleVars).reduce((t, c) => (t + `${c}:${styleVars[c]};`), '#sc-translator-root{') + '}';
};

const fontSizeToStyleText = (fontSize) => {
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

const setStyleInnerText = (text) => {
    style.innerText = text;
};

const injectStyle = (styleElement) => {
    if (style) { return; }

    style = styleElement ?? document.createElement('style');
    styleElement || document.head.appendChild(style);
};

export const injectThemeStyle = (styleElement) => {
    injectStyle(styleElement);

    getLocalStorage(['styleVarsList', 'styleVarsIndex'], (storage) => {
        styleVarsList = storage.styleVarsList;
        styleVarsIndex = storage.styleVarsIndex;
        updateStyle();
    });
    listenOptionsChange(['styleVarsList', 'styleVarsIndex'], (changes) => {
        'styleVarsList' in changes && (styleVarsList = changes.styleVarsList);
        'styleVarsIndex' in changes && (styleVarsIndex = changes.styleVarsIndex);
        updateStyle();
    });
};

export const injectFontSizeStyle = (styleElement) => {
    injectStyle(styleElement);

    getLocalStorage(['translatePanelFontSize'], (storage) => {
        translatePanelFontSize = storage.translatePanelFontSize;
        updateStyle();
    });
    listenOptionsChange(['translatePanelFontSize'], (changes) => {
        'translatePanelFontSize' in changes && (translatePanelFontSize = changes.translatePanelFontSize);
        updateStyle();
    });
};