import * as types from '../actionTypes/multipleTranslateTypes';

export const mtSetText = ({ text }) => ({
    type: types.MT_SET_TEXT,
    payload: { text }
});

export const mtRequestStart = ({ source }) => ({
    type: types.MT_REQUEST_START,
    payload: { source }
});

export const mtRequestFinish = ({ source, result }) => ({
    type: types.MT_REQUEST_FINISH,
    payload: { source, result }
});

export const mtRequestError = ({ source, errorCode }) => ({
    type: types.MT_REQUEST_ERROR,
    payload: { source, errorCode }
});

export const mtAddSource = ({ source, addType }) => ({
    type: types.MT_ADD_SOURCE,
    payload: { source, addType }
});

export const mtRemoveSource = ({ source }) => ({
    type: types.MT_REMOVE_SOURCE,
    payload: { source }
});

export const mtSetFromAndTo = ({ from, to }) => ({
    type: types.MT_SET_FROM_AND_TO,
    payload: { from, to}
});

export const mtInit = ({ sourceList, from, to }) => ({
    type: types.MT_INIT,
    payload: { sourceList, from, to }
});