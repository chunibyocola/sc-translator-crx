import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslateRequest, TranslateResult } from '../../types';

export type Translation = {
    source: string;
    translateRequest: TranslateRequest;
};

type MultipleTranslateState = {
    text: string;
    from: string;
    to: string;
    translateId: number;
    translations: Translation[];
};

const initialState: MultipleTranslateState = {
    text: '',
    from: '',
    to: '',
    translateId: 0,
    translations: []
};

export const multipleTranslateSlice = createSlice({
    name: 'multipleTranslate',
    initialState,
    reducers: {
        mtSetText: (state, { payload }: PayloadAction<{ text: string }>) => {
            if (payload.text !== state.text) {
                state.text = payload.text;
                state.translations = state.translations.map((v) => {
                    v.translateRequest = { status: 'init' };
                    return v;
                });
                state.translateId += 1;
            }
        },
        mtRequestStart: (state, { payload }: PayloadAction<{ source: string }>) => {
            state.translations = state.translations.map((v) => {
                if (v.source === payload.source) {
                    v.translateRequest = { status: 'loading' };
                }
                return v;
            });
        },
        mtRequestFinish: (state, { payload }: PayloadAction<{ source: string, result: TranslateResult }>) => {
            state.translations = state.translations.map((v) => {
                if (v.source === payload.source) {
                    v.translateRequest = { status: 'finished', result: payload.result };
                }
                return v;
            });
        },
        mtRequestError: (state, { payload }: PayloadAction<{ source: string, errorCode: string }>) => {
            state.translations = state.translations.map((v) => {
                if (v.source === payload.source) {
                    v.translateRequest = { status: 'error', errorCode: payload.errorCode };
                }
                return v;
            });
        },
        mtAddSource: (state, { payload }: PayloadAction<{ source: string, addType: number }>) => {
            const tempTranslation: Translation = {
                source: payload.source,
                translateRequest: { status: 'init' }
            };

            state.translations = payload.addType === 1 ? [tempTranslation, ...state.translations] : [...state.translations, tempTranslation];
        },
        mtRemoveSource: (state, { payload }: PayloadAction<{ source: string }>) => {
            state.translations = state.translations.filter(v => v.source !== payload.source);
        },
        mtSetFromAndTo: (state, { payload }: PayloadAction<{ from: string, to: string }>) => {
            state.from = payload.from;
            state.to = payload.to;
            state.translations = state.translations.map(v => ({
                ...v,
                status: { requesting: false, requestEnd: false, error: false }
            }));
            state.translateId += 1;
        },
        mtInit: (state, { payload }: PayloadAction<{ sourceList: string[], from: string, to: string }>) => {
            state.from = payload.from;
            state.to = payload.to;
            state.translations = payload.sourceList.map((v) => ({
                source: v,
                translateRequest: { status: 'init' }
            }));
        }
    }
});

export const { mtSetText, mtRequestStart, mtRequestFinish, mtRequestError, mtAddSource, mtRemoveSource, mtSetFromAndTo, mtInit } = multipleTranslateSlice.actions;

export default multipleTranslateSlice.reducer;