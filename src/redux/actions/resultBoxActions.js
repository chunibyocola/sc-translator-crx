import * as types from '../actionTypes/resultBoxTypes';

export const setResultBoxShowAndPosition = (pos) => ({
    type: types.SET_RESULT_BOX_SHOW_AND_POSITION,
    payload: pos
});

export const hideResultBox = () => ({ type: types.HIDE_RESULT_BOX });

export const initResultBoxState = (multiMode) => ({
    type: types.INIT_RESULT_BOX_STATE,
    payload: multiMode
});

export const callOutResultBox = () => ({ type: types.CALL_OUT_RESULT_BOX });

export const closeResultBox = () => ({ type: types.CLOSE_RESULT_BOX });

export const requestToHidePanel = () => ({ type: types.REQUEST_TO_HIDE_PANEL });