import * as types from '../actionTypes/resultBoxTypes';

const initState = {
    show: false,
    pos: { x: 5, y: 5 },
    pinning: false,
    focusRawText: 0,
    multipleMode: false,
};

const resultBoxState = (state = initState, { type, payload }) => {
    switch (type) {
        case types.SET_RESULT_BOX_SHOW_AND_POSITION:
            return { ...state, show: true, pos: payload };
        case types.HIDE_RESULT_BOX:
            return { ...state, show: false };
        case types.INIT_RESULT_BOX_STATE:
            return { ...state, multipleMode: payload, show: false, pos: { x: 5, y: 5 } };
        case types.CALL_OUT_RESULT_BOX:
            return { ...state, show: true, focusRawText: state.focusRawText + 1 };
        case types.CLOSE_RESULT_BOX:
            return { ...state, show: false, pinning: false };
        case types.REQUEST_TO_HIDE_PANEL:
            return { ...state, show: state.pinning && state.show };
        case types.SET_PANEL_PINNING:
            return { ...state, pinning: payload.pinning };
        default:
            return state;
    }
};

export default resultBoxState;