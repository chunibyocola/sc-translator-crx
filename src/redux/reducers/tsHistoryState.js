import * as types from '../actionTypes/tsHistoryTypes';

const initState = [];

const tsHistory = (state = initState, action) => {
    const {type, payload} = action;
    switch (type) {
        case types.ADD_HISTORY:
            return [...state, payload];
        case types.REMOVE_HISTORY:
            return state.filter((v, i) => (i !== payload.index));
        default:
            return state;
    }
};

export default tsHistory;