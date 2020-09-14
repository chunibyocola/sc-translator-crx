import * as types from '../actionTypes/resultBoxTypes';

const initState = {
    show: false,
    pos: { x: 5, y: 5 },
    focusRawText: 0,
    multipleMode: false
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
        default:
            return state;
    }
};

export default resultBoxState;