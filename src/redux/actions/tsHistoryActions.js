import * as types from '../actionTypes/tsHistoryTypes';

export const addHistory = result => ({
    type: types.ADD_HISTORY,
    payload: result
});

export const removeHistory = index => ({
    type: types.REMOVE_HISTORY,
    payload: {
        index
    }
});