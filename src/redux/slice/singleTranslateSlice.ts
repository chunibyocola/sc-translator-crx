import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TranslateRequest, TranslateResult } from '../../types';

type SingleTranslateState = {
    text: string,
    from: string,
    to: string,
    source: string,
    translateId: number,
    translateRequest: TranslateRequest
}

const initialState: SingleTranslateState = {
    text: '',
    from: '',
    to: '',
    source: 'google.com',
    translateId: 0,
    translateRequest: { status: 'init' }
};

export const singleTranslateSlice = createSlice({
    name: 'singleTranslate',
    initialState,
    reducers: {
        stSetText: (state, { payload }: PayloadAction<{ text: string }>) => {
            if (payload.text !== state.text) {
                state.text = payload.text;
                state.translateRequest = { status: 'init' };
                state.translateId += 1;
            }
        },
        stRequestStart: (state) => {
            state.translateRequest = { status: 'loading' };
        },
        stRequestFinish: (state, { payload }: PayloadAction<{ result: TranslateResult }>) => {
            state.translateRequest = { status: 'finished', result: payload.result };
        },
        stRequestError: (state, { payload }: PayloadAction<{ errorCode: string }>) => {
            state.translateRequest = { status: 'error', errorCode: payload.errorCode };
        },
        stSetFromAndTo: (state, { payload }: PayloadAction<{ from: string, to: string }>) => {
            state.translateRequest = { status: 'init' };
            state.from = payload.from;
            state.to = payload.to;
            state.translateId += 1;
        },
        stInit: (state, { payload }: PayloadAction<{ source: string, from: string, to: string }>) => {
            state.source = payload.source;
            state.from = payload.from;
            state.to = payload.to;
        },
        stSetSourceFromTo: (state, { payload }: PayloadAction<{ source: string, from: string, to: string }>) => {
            state.translateRequest = { status: 'init' };
            state.source = payload.source;
            state.from = payload.from;
            state.to = payload.to;
            state.translateId += 1;
        },
        stSetTo: (state, { payload }: PayloadAction<{ to: string }>) => {
            state.to = payload.to;
        }
    }
});

export const { stSetText, stRequestStart, stRequestFinish, stRequestError, stSetFromAndTo, stInit, stSetSourceFromTo, stSetTo } = singleTranslateSlice.actions;

export default singleTranslateSlice.reducer;