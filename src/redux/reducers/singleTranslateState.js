import * as types from '../actionTypes/singleTranslateTypes';

const initState = {
    text: '',
    from: '',
    to: '',
    source: 'google.com',
    status: { requesting: false, requestEnd: false, error: false, errorCode: '' },
    result: {},
    history: [],
    resultFromHistory: false
};

const singleTranslateState = (state = initState, { type, payload }) => {
    switch (type) {
        case types.ST_SET_TEXT:
            return { ...state, status: { requesting: false, requestEnd: false, error: false }, text: payload.text, resultFromHistory: false };
        case types.ST_REQUEST_START:
            return { ...state, status: { requesting: true, requestEnd: false, error: false }, result: {}, resultFromHistory: false };
        case types.ST_REQUEST_FINISH:
            return { ...state, status: { requesting: false, requestEnd: true, error: false }, result: payload.result, resultFromHistory: false };
        case types.ST_REQUEST_ERROR:
            return { ...state, status: { requesting: false, requestEnd: true, error: true, errorCode: payload.errorCode }, result: {}, resultFromHistory: false };
        case types.ST_SET_SOURCE:
            return { ...state, status: { requesting: false, requestEnd: false, error: false }, source: payload.source, from: '', to: '' };
        case types.ST_SET_FROM_AND_TO:
            return { ...state, status: { requesting: false, requestEnd: false, error: false }, from: payload.from, to: payload.to };
        case types.ST_SET_FROM:
            return { ...state, from: payload.from };
        case types.ST_SET_TO:
            return { ...state, to: payload.to };
        case types.ST_INIT:
            return { ...state, source: payload.source, from: payload.from, to: payload.to };
        case types.ST_SET_RESULT_FROM_HISTORY:
            return { ...state, status: { requesting: false, requestEnd: true, error: false }, result: payload.result, resultFromHistory: true };
        case types.ST_ADD_HISTORY:
            return { ...state, history: [ ...state.history, payload.result ] };
        case types.ST_REMOVE_HISTORY:
            return { ...state, history: state.history.filter((v, i) => (i !== payload.historyIndex)) };
        default: return state;
    }
};

export default singleTranslateState;