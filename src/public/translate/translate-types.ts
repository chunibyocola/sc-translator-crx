export type TranslateParams = {
    text: string;
    from?: string;
    to?: string;
    preferredLanguage?: string;
    secondPreferredLanguage?: string;
    com?: boolean;
};

export type AudioParams = {
    text: string;
    from?: string;
    com?: boolean;
};

export type DetectParams = {
    text: string;
    com?: boolean;
};