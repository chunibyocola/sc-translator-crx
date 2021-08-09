import { StyleVarsList } from "../constants/defaultStyleVars";

export type TranslateResult = {
    text: string;
    from: string;
    to: string;
    result: string[];
    dict?: string[];
    phonetic?: string;
    related?: string[];
};

export type TranslateRequestInit = {
    status: 'init';
}

export type TranslateRequestLoading = {
    status: 'loading';
}

export type TranslateRequestFinished = {
    status: 'finished';
    result: TranslateResult;
}

export type TranslateRequestError = {
    status: 'error';
    errorCode: string;
}

export type TranslateRequest = TranslateRequestInit | TranslateRequestLoading | TranslateRequestFinished | TranslateRequestError;

export type Position = {
    x: number;
    y: number;
};

export type HistoryPanelStatus = { pin: boolean; width: number };

export type OptionsContextMenu = { id: string; enabled: boolean };

export type TextPreprocessingRegExp = { pattern: string; flags: string; replacement: string };
export type TextPreprocessingPreset = { convertCamelCase: boolean };

export type DefaultOptions = {
    userLanguage: string;
    defaultTranslateSource: string;
    defaultTranslateFrom: string;
    defaultTranslateTo: string;
    translateDirectly: boolean;
    translateBlackListMode: boolean;
    translateHostList: string[];
    historyBlackListMode: boolean;
    historyHostList: string[];
    showButtonAfterSelect: boolean;
    defaultAudioSource: string;
    translateWithKeyPress: boolean;
    useDotCn: boolean;
    multipleTranslateMode: boolean;
    multipleTranslateSourceList: string[];
    multipleTranslateFrom: string;
    multipleTranslateTo: string;
    enablePdfViewer: boolean;
    preferredLanguage: string;
    secondPreferredLanguage: string;
    styleVarsList: StyleVarsList;
    styleVarsIndex: number;
    btnPosition: Position;
    audioVolume: number;
    audioPlaybackRate: number;
    hideButtonAfterFixedTime: boolean;
    hideButtonFixedTime: number;
    respondToSeparateWindow: boolean;
    // 'stw' means 'Separate translate Window'
    rememberStwSizeAndPosition: boolean;
    stwSizeAndPosition: { width: number; height: number; left: number; top: number };
    pinThePanelWhileOpeningIt: boolean;
    rememberPositionOfPinnedPanel: boolean;
    positionOfPinnedPanel: Position;
    translatePanelMaxHeight: { percentage: boolean; px: number; percent: number };
    translatePanelWidth: { percentage: boolean; px: number; percent: number };
    translatePanelFontSize: number;
    recentTranslateFromList: string[];
    recentTranslateToList: string[];
    rememberHistoryPanelStatus: boolean;
    historyPanelStatus: HistoryPanelStatus;
    translateDirectlyWhilePinning: boolean;
    doNotRespondInTextBox: boolean;
    autoTranslateAfterInput: boolean;
    contextMenus: OptionsContextMenu[];
    clipboardReadPermission: boolean;
    autoPasteInTheInputBox: boolean;
    enableInsertResult: boolean;
    autoInsertResult: boolean;
    textPreprocessingRegExpList: TextPreprocessingRegExp[];
    textPreprocessingPreset: TextPreprocessingPreset;
    customizeStyleText: string;
};