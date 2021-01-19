import { resultToString } from '../../public/utils';
import * as types from '../actionTypes/translateHistoryTypes';

const initState = [];
const startStatus = { requesting: true, requestEnd: false, error: false, errorCode: '' };
const finishStatus = { requesting: false, requestEnd: true, error: false, errorCode: '' };
const errorStatus = { requesting: false, requestEnd: true, error: true, errorCode: '' };

const translateHistoryState = (state = initState, { type, payload }) => {
    switch (type) {
        case types.ADD_HISTORY:
            return state.concat({
                translateId: payload.translateId,
                text: payload.text,
                result: null,
                translations: payload.sourceList.map((source) => ({ source, status: { ...startStatus }, result: {} }))
            });
        case types.UPDATE_HISTORY_FINISH:
            return state.map((historyItem) => {
                if (historyItem.translateId === payload.translateId) {
                    const index = historyItem.translations.findIndex(translation => translation.source === payload.source);
                    if (index >= 0) {
                        historyItem.translations[index] = { ...historyItem.translations[index], status: { ...finishStatus }, result: payload.result };
                    }
                    else {
                        historyItem.translations = historyItem.translations.concat({ source: payload.source, status: { ...finishStatus }, result: payload.result });
                    }
                    !historyItem.result && (historyItem.result = resultToString(payload.result.result));
                }
                return historyItem;
            });
        case types.UPDATE_HISTORY_ERROR:
            return state.map((historyItem) => {
                if (historyItem.translateId === payload.translateId) {
                    const index = historyItem.translations.findIndex(translation => translation.source === payload.source);
                    if (index >= 0) {
                        historyItem.translations[index] = { ...historyItem.translations[index], status: { ...errorStatus, errorCode: payload.errorCode } };
                    }
                    else {
                        historyItem.translations = historyItem.translations.concat({ source: payload.source, status: { ...errorStatus, errorCode: payload.errorCode } });
                    }
                }
                return historyItem;
            });
        case types.REMOVE_HISTORY:
            return state.filter(historyItem => historyItem.translateId !== payload.translateId);
        default: return state;
    }
};

export default translateHistoryState;