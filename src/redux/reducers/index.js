import { combineReducers } from 'redux';
import resultBoxState from './resultBoxState';
import multipleTranslateState from './multipleTranslateState';
import singleTranslateState from './singleTranslateState';
import translateHistoryState from './translateHistoryState';

export default combineReducers({
    resultBoxState,
    multipleTranslateState,
    singleTranslateState,
    translateHistoryState
});