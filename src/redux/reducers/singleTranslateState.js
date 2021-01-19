import * as types from '../actionTypes/singleTranslateTypes';

const initState = {
    text: '',
    from: '',
    to: '',
    source: 'google.com',
    translateId: 0,
    status: { requesting: false, requestEnd: false, error: false, errorCode: '' },
    result: {},
    history: [],
    resultFromHistory: false
};

const singleTranslateState = (state = initState, { type, payload }) => {
    switch (type) {
        case types.ST_SET_TEXT:
            return { ...state, status: { requesting: false, requestEnd: false, error: false }, text: payload.text, resultFromHistory: false, translateId: state.translateId + 1 };
        case types.ST_REQUEST_START:
            return { ...state, status: { requesting: true, requestEnd: false, error: false }, result: {}, resultFromHistory: false };
        case types.ST_REQUEST_FINISH:
            return { ...state, status: { requesting: false, requestEnd: true, error: false }, result: payload.result, resultFromHistory: false };
        case types.ST_REQUEST_ERROR:
            return { ...state, status: { requesting: false, requestEnd: true, error: true, errorCode: payload.errorCode }, result: {}, resultFromHistory: false };
        case types.ST_SET_FROM_AND_TO:
            return { ...state, status: { requesting: false, requestEnd: false, error: false }, from: payload.from, to: payload.to, translateId: state.translateId + 1 };
        case types.ST_INIT:
            return { ...state, source: payload.source, from: payload.from, to: payload.to };
        case types.ST_SET_SOURCE_FROM_TO:
            return { ...state, status: { requesting: false, requestEnd: false, error: false }, source: payload.source, from: payload.from, to: payload.to, translateId: state.translateId + 1 };
        default: return state;
    }
};

export default singleTranslateState;