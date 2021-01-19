import * as types from '../actionTypes/translateHistoryTypes';

export const addHistory = ({ translateId, text, sourceList }) => ({
    type: types.ADD_HISTORY,
    payload: {
        translateId,
        text,
        sourceList
    }
});

export const updateHistoryFinish = ({ translateId, source, result }) => ({
    type: types.UPDATE_HISTORY_FINISH,
    payload: {
        translateId,
        source,
        result
    }
});

export const updateHistoryError = ({ translateId, source, errorCode }) => ({
    type: types.UPDATE_HISTORY_ERROR,
    payload: {
        translateId,
        source,
        errorCode
    }
});

export const removeHistory = ({ translateId }) => ({
    type: types.REMOVE_HISTORY,
    payload: {
        translateId
    }
});