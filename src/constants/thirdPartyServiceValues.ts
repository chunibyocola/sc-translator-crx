import {
    TPSChatGPTValue,
    TPSGeminiValue,
    TPSOpenAIValue
} from '../types/thirdPartyValue';

export const defaultGeminiValue: Required<TPSGeminiValue> = {
    name: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    model: 'gemini-2.0-flash',
    prompt: '',
    key: ''
};

export const defaultChatGPTValue: Required<TPSChatGPTValue> = {
    name: 'ChatGPT',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-5',
    prompt: '',
    key: ''
};

export const defaultOpenAIValue: Required<TPSOpenAIValue> = {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-5',
    prompt: '',
    key: ''
};

export const serviceDefaultValueMap = new Map<string, any>([
    [defaultGeminiValue.name, defaultGeminiValue],
    [defaultChatGPTValue.name, defaultChatGPTValue],
    [defaultOpenAIValue.name, defaultOpenAIValue]
]);

export const thirdPartyServiceNames = ['Gemini', 'ChatGPT', 'OpenAI'] as const;