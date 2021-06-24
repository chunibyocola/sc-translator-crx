import { getLocalStorage } from "./chrome-call";
import { listenOptionsChange } from "./options";

let textPreprocessingRegExpList = [];

export const textPreprocessing = (text) => {
    if (!text) { return text; }

    const tempText = text;

    try {
        textPreprocessingRegExpList.map(({ pattern, flags, replacement }) => (text = text.replace(new RegExp(pattern, flags), replacement)));

        return text.trimLeft();
    }
    catch {
        return tempText;
    }
};

getLocalStorage(['textPreprocessingRegExpList'], (options) => {
    textPreprocessingRegExpList = options.textPreprocessingRegExpList ?? [];
});
listenOptionsChange(['textPreprocessingRegExpList'], (changes) => {
    textPreprocessingRegExpList = changes.textPreprocessingRegExpList ?? [];
});