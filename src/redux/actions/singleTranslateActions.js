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

export const stSetFromAndTo = ({ from, to }) => ({
    type: types.ST_SET_FROM_AND_TO,
    payload: { from, to }
});

export const stInit = ({ source, from, to }) => ({
    type: types.ST_INIT,
    payload: { source, from, to }
});

export const stSetSourceFromTo = ({ source, from, to }) => ({
    type: types.ST_SET_SOURCE_FROM_TO,
    payload: { source, from, to }
});