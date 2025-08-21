import { TPSGeminiValue } from '../types/thirdPartyValue';

export const defaultGeminiValue: Required<TPSGeminiValue> = {
    name: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    model: 'gemini-2.0-flash',
    prompt: '',
    key: ''
};

export const serviceDefaultValueMap = new Map([
    [defaultGeminiValue.name, defaultGeminiValue]
]);

export const thirdPartyServiceNames = ['Gemini'] as const;