import * as types from '../actionTypes/tsResultTypes';

export const finishRequest = payload => ({
    type: types.FINISH_REQUEST,
    payload
});

export const errorRequest = payload => ({
    type: types.ERROR_REQUEST,
    payload
});

export const requestTsResultWithOutResultObject = text => ({
    type: types.REQUEST_TS_RESULT_WITHOUT_RESULT_OBJECT,
    payload: {
        text
    }
});

export const requestTsResultWithText = (text) => ({
    type: types.REQUEST_TS_RESULT_WITH_TEXT,
    payload: {
        text
    }
});

export const requestTsResultWithResultObject = resultObj => ({
    type: types.REQUEST_TS_RESULT_WITH_RESULT_OBJECT,
    payload: {
        resultObj,
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