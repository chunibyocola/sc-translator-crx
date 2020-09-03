import { combineReducers } from 'redux';
import tsHistoryState from './tsHistoryState';
import tsResultState from './tsResultState';
import translationState from './translationState';
import resultBoxState from './resultBoxState';
import multipleTranslateState from './multipleTranslateState';

export default combineReducers({
    tsHistoryState,
    tsResultState,
    translationState,
    resultBoxState,
    multipleTranslateState
});