import * as types from '../actionTypes/singleTranslateTypes';

export const stSetText = ({ text }) => ({
    type: types.ST_SET_TEXT,
    payload: { text }
});

export const stRequestStart = () => ({
    type: types.ST_REQUEST_START
});

export const stRequestFinish = ({ result }) => ({
    type: types.ST_REQUEST_FINISH,
    payload: { result }
});

export const stRequestError = ({ errorCode }) => ({
    type: types.ST_REQUEST_ERROR,
    payload: { errorCode }
});

export const stSetSource = ({ source }) => ({
    type: types.ST_SET_SOURCE,
    payload: { source }
});

export const stSetFrom = ({ from }) => ({
    type: types.ST_SET_FROM,
    payload: { from }
});

export const stSetTo = ({ to }) => ({
    type: types.ST_SET_TO,
    payload: { to }
});

export const stSetFromAndTo = ({ from, to }) => ({
    type: types.ST_SET_FROM_AND_TO,
    payload: { from, to }
});

export const stInit = ({ source, from, to }) => ({
    type: types.ST_INIT,
    payload: { source, from, to }
});

export const stSetResultFromHistory = ({ result }) => ({
    type: types.ST_SET_RESULT_FROM_HISTORY,
    payload: { result }
});

export const stAddHistory = ({ result }) => ({
    type: types.ST_ADD_HISTORY,
    payload: { result }
});

export const stRemoveHistory = ({ historyIndex }) => ({
    type: types.ST_REMOVE_HISTORY,
    payload: { historyIndex }
});

export const stRetry = () => ({
    type: types.ST_RETRY
});