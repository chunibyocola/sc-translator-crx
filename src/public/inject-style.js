import { getLocalStorage } from './chrome-call';
import { listenOptionsChange } from './options';
import { defaultStyleVars } from '../constants/defaultStyleVars';

let styleVarsList = [];
let styleVarsIndex = 0;
const head = document.head || document.querySelector('head');
let style = document.createElement('style');
head.appendChild(style);

const styleVarsToStyleText = (styleVars) => {
    styleVars = { ...defaultStyleVars, ...styleVars };
    return Object.keys(styleVars).reduce((t, c) => (t + `${c}:${styleVars[c]};`), '#sc-translator-root{') + '}';
};

const updateStyle = () => {
    let text = '';
    if (styleVarsIndex < styleVarsList.length && styleVarsList[styleVarsIndex] && styleVarsList[styleVarsIndex].styleVars) {
        text = styleVarsToStyleText(styleVarsList[styleVarsIndex].styleVars);
    }
    else {
        text = styleVarsToStyleText(defaultStyleVars);
    }
    setStyleInnerText(text);
};

const setStyleInnerText = (text) => {
    style.innerText = text;
};

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