import * as types from '../actionTypes/tsResultTypes';

const initState = {
    requestEnd: false,
    requesting: false,
    err: false,
    errCode: '',
    show: false,
    pos: {x: 0, y: 0},
    resultObj: {},
    withResultObj: false,
    text: ''
};

const tsResultState = (state = initState, action) => {
    const {type, payload} = action;
    switch (type) {
        case types.SHOW_TS_RESULT_WITHOUT_RESULT_OBJECT:
            return {
                ...state,
                requestEnd: false,
                requesting: false,
                err: false,
                show: true,
                withResultObj: false,
                pos: payload.pos,
                text: payload.text,
                resultObj: {}
            };
        case types.SHOW_TS_RESULT_WITH_TEXT:
            return {
                ...state,
                requestEnd: false,
                requesting: false,
                err: false,
                show: true,
                withResultObj: false,
                text: payload.text,
                resultObj: {}
            };
        case types.SHOW_TS_RESULT_WITH_RESULT_OBJECT:
            return {
                ...state,
                requestEnd: true,
                requesting: false,
                err: false,
                show: true,
                withResultObj: true,
                text: payload.text,
                pos: payload.pos,
                resultObj: payload.resultObj
            };
        case types.SHOW_TS_RESULT:
            return {
                ...state,
                show: true
            };
        case types.HIDE_TS_RESULT:
            return {
                ...state,
                show: false
            };
        case types.START_REQUEST:
            return {
                ...state,
                requestEnd: false,
                requesting: true
            };
        case types.FINISH_REQUEST:
            return {
                ...state,
                requestEnd: true,
                requesting: false,
                err: false,
                resultObj: payload
            };
        case types.ERROR_REQUEST:
            return {
                ...state,
                err: true,
                errCode: payload,
                requestEnd: true,
                requesting: false
            };
        default:
            return state;
    }
};

export default tsResultState;