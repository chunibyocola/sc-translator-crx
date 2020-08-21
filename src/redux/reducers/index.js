import {combineReducers} from 'redux';
import tsHistoryState from './tsHistoryState';
import tsResultState from './tsResultState';
import translationState from './translationState';
import resultBoxState from './resultBoxState';

export default combineReducers({
    tsHistoryState,
    tsResultState,
    translationState,
    resultBoxState
});