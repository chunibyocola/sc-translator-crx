import * as types from '../actionTypes/translationTypes';

const initState = {
    source: 'google.com',
    from: '',
    to: ''
};

const translationState = (state = initState, action) => {
    const {type, payload} = action;
    switch (type) {
        case types.TRANSLATION_SET_SOURCE:
            return {...state, source: payload};
        case types.TRANSLATION_SET_FROM:
            return {...state, from: payload};
        case types.TRANSLATION_SET_TO:
            return {...state, to: payload};
        case types.TRANSLATION_SWAP_FROM_AND_TO:
            return {...state, from: state.to, to: state.from};
        case types.TRANSLATION_UPDATE:
            return {...state, ...payload};
        default:
            return state;
    }
};

export default translationState;