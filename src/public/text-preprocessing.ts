import { DefaultOptions, TextPreprocessingPreset, TextPreprocessingRegExp } from "../types";
import { getLocalStorage } from "./chrome-call";
import { listenOptionsChange } from "./options";

let textPreprocessingRegExpList: TextPreprocessingRegExp[] = [];
let textPreprocessingPreset: TextPreprocessingPreset = { convertCamelCase: false };

const convertCamelCase  = (text: string) => {
    return text.replace(/(?<=[a-zA-Z])[A-Z](?=[a-z])/g, (match) => (` ${match.toLowerCase()}`));
};

export const textPreprocessing = (text: string) => {
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

type PickedOptions = Pick<DefaultOptions, 'textPreprocessingRegExpList' | 'textPreprocessingPreset'>;
const keys: (keyof PickedOptions)[] = ['textPreprocessingPreset', 'textPreprocessingRegExpList']
getLocalStorage<PickedOptions>(keys, (options) => {
    textPreprocessingRegExpList = options.textPreprocessingRegExpList ?? [];
    textPreprocessingPreset = options.textPreprocessingPreset ?? {};
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.textPreprocessingRegExpList !== undefined && (textPreprocessingRegExpList = changes.textPreprocessingRegExpList);
    changes.textPreprocessingPreset !== undefined && (textPreprocessingPreset = changes.textPreprocessingPreset);
});