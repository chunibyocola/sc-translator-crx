import * as types from '../actionTypes/translationTypes';

export const translationSetSource = (source) => ({
    type: types.TRANSLATION_SET_SOURCE,
    payload: source
});

export const translationSetFrom = (from) => ({
    type: types.TRANSLATION_SET_FROM,
    payload: from
});

export const translationSetTo = (to) => ({
    type: types.TRANSLATION_SET_TO,
    payload: to
});

export const translationSwapFromAndTo = () => ({
    type: types.TRANSLATION_SWAP_FROM_AND_TO
});

export const translationUpdate = (source, from, to) => ({
    type: types.TRANSLATION_UPDATE,
    payload: {
        source,
        from,
        to
    }
});

export const translationSetFromAndTo = (from, to) => ({
    type: types.TRANSLATION_SET_FROM_AND_TO,
    payload: {
        from,
        to
    }
});