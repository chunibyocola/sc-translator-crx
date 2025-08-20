export type TPSGeminiValue = {
    name: 'Gemini'
    url?: string;
    model?: string;
    prompt?: string;
    key?: string;
};

export type EnabledThirdPartyServices = (TPSGeminiValue)[];