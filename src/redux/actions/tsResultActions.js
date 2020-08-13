import * as types from '../actionTypes/tsResultTypes';

export const finishRequest = payload => ({
    type: types.FINISH_REQUEST,
    payload
});

export const errorRequest = payload => ({
    type: types.ERROR_REQUEST,
    payload
});

export const showTsResultWithOutResultObject = (text, pos) => ({
    type: types.SHOW_TS_RESULT_WITHOUT_RESULT_OBJECT,
    payload: {
        text,
        pos
    }
});

export const showTsResultWithText = (text) => ({
    type: types.SHOW_TS_RESULT_WITH_TEXT,
    payload: {
        text
    }
});

export const showTsResultWithResultObject = (resultObj, pos) => ({
    type: types.SHOW_TS_RESULT_WITH_RESULT_OBJECT,
    payload: {
        resultObj,
        pos,
        text: resultObj.text
    }
});

export const showTsResult = () => ({
    type: types.SHOW_TS_RESULT
});

export const hideTsResult = () => ({
    type: types.HIDE_TS_RESULT
});

export const startRequest = () => ({
    type: types.START_REQUEST
});

export const setTsResultPosition = (pos) => ({
    type: types.SET_TS_RESULT_POSITION,
    payload: pos
});