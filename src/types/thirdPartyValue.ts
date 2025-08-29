export type TPSGeminiValue = {
    name: 'Gemini'
    url?: string;
    model?: string;
    prompt?: string;
    key?: string;
};

export type TPSChatGPTValue = {
    name: 'ChatGPT'
    url?: string;
    model?: string;
    prompt?: string;
    key?: string;
};

export type TPSOpenAIValue = {
    name: 'OpenAI'
    url?: string;
    model?: string;
    prompt?: string;
    key?: string;
};

export type EnabledThirdPartyServices = (
    TPSGeminiValue
    | TPSChatGPTValue
    | TPSOpenAIValue
)[];