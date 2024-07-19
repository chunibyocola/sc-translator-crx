import { DefaultOptions, GetStorageKeys, TextPreprocessingPreset, TextPreprocessingRegExp } from "../types";
import { getLocalStorage } from "./chrome-call";
import { listenOptionsChange } from "./options";

let textPreprocessingRegExpList: TextPreprocessingRegExp[] = [];
let textPreprocessingPreset: TextPreprocessingPreset = { convertCamelCase: false };

let afterSelectingTextRegExpList: TextPreprocessingRegExp[] = [];

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

export const selectedTextPreprocessing = (text: string) => {
    if (!text) { return text; }

    const tempText = text;

    try {
        afterSelectingTextRegExpList.forEach(({ pattern, flags, replacement }) => (text = text.replace(new RegExp(pattern, flags), replacement)));
    }
    catch {
        text = tempText;
    }

    return text.replace(/[\P{L}]/ug, '');
};

type PickedOptions = Pick<DefaultOptions, 'textPreprocessingRegExpList' | 'textPreprocessingPreset' | 'afterSelectingTextRegExpList'>;
const keys: GetStorageKeys<
    'textPreprocessingRegExpList' |
    'textPreprocessingPreset' |
    'afterSelectingTextRegExpList'
> = [
    'textPreprocessingPreset',
    'textPreprocessingRegExpList',
    'afterSelectingTextRegExpList'
];
getLocalStorage<PickedOptions>(keys, (options) => {
    textPreprocessingRegExpList = options.textPreprocessingRegExpList ?? [];
    textPreprocessingPreset = options.textPreprocessingPreset ?? {};
    afterSelectingTextRegExpList = options.afterSelectingTextRegExpList ?? [];
});
listenOptionsChange(keys, (changes) => {
    changes.textPreprocessingRegExpList !== undefined && (textPreprocessingRegExpList = changes.textPreprocessingRegExpList);
    changes.textPreprocessingPreset !== undefined && (textPreprocessingPreset = changes.textPreprocessingPreset);
    changes.afterSelectingTextRegExpList !== undefined && (afterSelectingTextRegExpList = changes.afterSelectingTextRegExpList);
});