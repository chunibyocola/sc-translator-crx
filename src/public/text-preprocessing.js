import { getLocalStorage } from "./chrome-call";
import { listenOptionsChange } from "./options";

let textPreprocessingRegExpList = [];
let textPreprocessingPreset = {};

const convertCamelCase  = (text) => {
    return text.replace(/(?<=[a-zA-Z])[A-Z](?=[a-z])/g, (match) => (` ${match.toLowerCase()}`));
};

export const textPreprocessing = (text) => {
    if (!text) { return text; }

    const tempText = text;

    try {
        textPreprocessingRegExpList.map(({ pattern, flags, replacement }) => (text = text.replace(new RegExp(pattern, flags), replacement)));

        textPreprocessingPreset.convertCamelCase && (text = convertCamelCase(text));

        return text.trimLeft();
    }
    catch {
        return tempText;
    }
};

getLocalStorage(['textPreprocessingRegExpList', 'textPreprocessingPreset'], (options) => {
    textPreprocessingRegExpList = options.textPreprocessingRegExpList ?? [];
    textPreprocessingPreset = options.textPreprocessingPreset ?? {};
});
listenOptionsChange(['textPreprocessingRegExpList', 'textPreprocessingPreset'], (changes) => {
    textPreprocessingRegExpList = changes.textPreprocessingRegExpList ?? [];
    textPreprocessingPreset = changes.textPreprocessingPreset ?? {};
});