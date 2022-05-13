import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslateResult, Translation } from '../../types';
import { resultToString } from '../../public/utils';

export type TranslateHistoryItem = {
    translateId: number,
    text: string,
    result: string | null,
    translations: Translation[]
};

type TranslateHistoryState = TranslateHistoryItem[];

const initialState: TranslateHistoryState = [];

export const translateHistorySlice = createSlice({
    name: 'translateHistory',
    initialState,
    reducers: {
        addHistory: (state, { payload }: PayloadAction<{ translateId: number, text: string, sourceList: string[] }>) => {
            const translateHistoryItem: TranslateHistoryItem = {
                translateId: payload.translateId,
                text: payload.text,
                result: null,
                translations: payload.sourceList.map((v) => ({
                    source: v,
                    translateRequest: { status: 'init' }
                }))
            };
            state = state.concat(translateHistoryItem);
            return state;
        },
        updateHistoryFinish: (state, { payload }: PayloadAction<{ translateId: number, source: string, result: TranslateResult }>) => {
            state = state.map((historyItem) => {
                if (historyItem.translateId === payload.translateId) {
                    const index = historyItem.translations.findIndex(translation => translation.source === payload.source);
                    if (index >= 0) {
                        historyItem.translations[index].translateRequest = { status: 'finished', result: payload.result };
                    }
                    else {
                        historyItem.translations = historyItem.translations.concat({
                            source: payload.source,
                            translateRequest: { status: 'finished', result: payload.result }
                        });
                    }
                    !historyItem.result && (historyItem.result = resultToString(payload.result.result));
                }
                return historyItem;
            });
        },
        updateHistoryError: (state, { payload }: PayloadAction<{ translateId: number, source: string, errorCode: string }>) => {
            state = state.map((historyItem) => {
                if (historyItem.translateId === payload.translateId) {
                    const index = historyItem.translations.findIndex(translation => translation.source === payload.source);
                    if (index >= 0) {
                        historyItem.translations[index].translateRequest = { status: 'error', errorCode: payload.errorCode };
                    }
                    else {
                        historyItem.translations = historyItem.translations.concat({
                            source: payload.source,
                            translateRequest: { status: 'error', errorCode: payload.errorCode }
                        });
                    }
                }
                return historyItem;
            });
        },
        removeHistory: (state, { payload }: PayloadAction<{ translateId: number }>) => {
            state = state.filter(historyItem => historyItem.translateId !== payload.translateId);
            return state;
        }
    }
});

export const { addHistory, updateHistoryFinish, updateHistoryError, removeHistory } = translateHistorySlice.actions;

export default translateHistorySlice.reducer;