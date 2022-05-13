import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslateResult, Translation } from '../../types';

type TranslationState = {
    text: string;
    from: string;
    to: string;
    translateId: number;
    translations: Translation[];
};

const initialState: TranslationState = {
    text: '',
    from: '',
    to: '',
    translateId: 0,
    translations: []
};

export const translationSlice = createSlice({
    name: 'translation',
    initialState,
    reducers: {
        nextTranslaion: (state, { payload: { text, from, to } }: PayloadAction<{ text?: string; from?: string; to?: string; }>) => {
            if ((typeof text === 'string' && text !== state.text) || (typeof from === 'string' && from !== state.from) || (typeof to === 'string' && to !== state.to)) {
                state.text = text ?? state.text;
                state.from = from ?? state.from;
                state.to = to ?? state.to;
                state.translations = state.translations.map((translation) => ({
                    ...translation,
                    translateRequest: { status: 'init' }
                }));
                state.translateId += 1;
            }
        },
        requestStart: (state, { payload }: PayloadAction<{ source: string }>) => {
            state.translations = state.translations.map((translation) => {
                if (translation.source === payload.source) {
                    translation.translateRequest = { status: 'loading' };
                }
                return translation;
            });
        },
        requestFinish: (state, { payload }: PayloadAction<{ source: string; result: TranslateResult; }>) => {
            state.translations = state.translations.map((translation) => {
                if (translation.source === payload.source) {
                    translation.translateRequest = { status: 'finished', result: payload.result };
                }
                return translation;
            });
        },
        requestError: (state, { payload }: PayloadAction<{ source: string; errorCode: string; }>) => {
            state.translations = state.translations.map((translation) => {
                if (translation.source === payload.source) {
                    translation.translateRequest = { status: 'error', errorCode: payload.errorCode };
                }
                return translation;
            });
        },
        addSource: (state, { payload }: PayloadAction<{ source: string; addType: number; }>) => {
            const tempTranslation: Translation = {
                source: payload.source,
                translateRequest: { status: 'init' }
            };

            if (payload.addType === 0) {
                state.translations = [...state.translations, tempTranslation];
            }
            else if (payload.addType === 1) {
                state.translations = [tempTranslation, ...state.translations];
            }
        },
        removeSource: (state, { payload }: PayloadAction<{ source: string; }>) => {
            state.translations = state.translations.filter(translation => translation.source !== payload.source);
        },
        singleChangeSource: (state, { payload }: PayloadAction<{ source: string; from: string; to: string; }>) => {
            state.translations = [{ source: payload.source, translateRequest: { status: 'init' } }];
            state.from = payload.from;
            state.to = payload.to;
            state.translateId += 1;
        },
        init: (state, { payload }: PayloadAction<{ sourceList: string[]; from: string; to: string; }>) => {
            state.from = payload.from;
            state.to = payload.to;
            state.translations = payload.sourceList.map((source) => ({
                source,
                translateRequest: { status: 'init' }
            }));
        }
    }
});

export const {
    nextTranslaion,
    requestStart,
    requestFinish,
    requestError,
    addSource,
    removeSource,
    singleChangeSource,
    init,
} = translationSlice.actions;

export default translationSlice.reducer;