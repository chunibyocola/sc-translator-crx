import * as types from '../actionTypes/multipleTranslateTypes';

const initState = {
    text: '',
    from: '',
    to: '',
    translations: []
};

const multipleTranslateState = (state = initState, { type, payload }) => {
    switch (type) {
        case types.MT_ADD_SOURCE:
            const tempTranslation = {
                source: payload.source,
                status: {
                    requestEnd: false,
                    requesting: false,
                    error: false,
                    errorCode: '',
                },
                result: {}
            };
            return { ...state, translations: payload.addType === 1 ? [tempTranslation, ...state.translations] : [...state.translations, tempTranslation] };
        case types.MT_REMOVE_SOURCE:
            return { ...state, translations: state.translations.filter(v => v.source !== payload.source) };
        case types.MT_SET_TEXT:
            return { ...state, text: payload.text, translations: state.translations.map(v => ({ ...v, status: { requesting: false, requestEnd: false, error: false } })) };
        case types.MT_REQUEST_START:
            return { ...state, translations: state.translations.map((v) => {
                if (v.source === payload.source) {
                    v.status = {
                        requesting: true,
                        requestEnd: false,
                        error: false
                    };
                    v.result = {};
                }
                return v;
            }) };
        case types.MT_REQUEST_FINISH:
            return { ...state, translations: state.translations.map((v) => {
                if (v.source === payload.source) {
                    v.status = {
                        requesting: false,
                        requestEnd: true,
                        error: false
                    };
                    v.result = payload.result;
                }
                return v;
            }) };
        case types.MT_REQUEST_ERROR:
            return { ...state, translations: state.translations.map((v) => {
                if (v.source === payload.source) {
                    v.status = {
                        requesting: false,
                        requestEnd: true,
                        error: true,
                        errorCode: payload.errorCode
                    };
                    v.result = {};
                }
                return v;
            }) };
        case types.MT_SET_FROM:
            return { ...state, from: payload.from };
        case types.MT_SET_TO:
            return { ...state, to: payload.to };
        case types.MT_SET_FROM_AND_TO:
            return { ...state, from: payload.from, to: payload.to, translations: state.translations.map(v => ({ ...v, status: { requesting: false, requestEnd: false, error: false } })) };
        case types.MT_INIT:
            return { ...state, from: payload.from, to: payload.to, translations: payload.sourceList.map(v => ({
                source: v,
                status: {
                    requestEnd: false,
                    requesting: false,
                    error: false,
                    errorCode: '',
                },
                result: {}
            })) };
        default:
            return state;
    }
};

export default multipleTranslateState;