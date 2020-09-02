import {getStoreDispatch} from '../store';
import {translationUpdate} from '../actions/translationActions';
import { mtInit } from '../actions/multipleTranslateActions';

export const initTranslation = ({
    defaultTranslateSource = 'google.com',
    defaultTranslateFrom = '',
    defaultTranslateTo = ''
}) => getStoreDispatch()(translationUpdate(
    defaultTranslateSource,
    defaultTranslateFrom,
    defaultTranslateTo
));

export const initMultipleTranslate = ({
    multipleTranslateSourceList = [],
    multipleTranslateFrom = '',
    multipleTranslateTo = ''
}) => getStoreDispatch()(mtInit({
    sourceList: multipleTranslateSourceList,
    from: multipleTranslateFrom,
    to: multipleTranslateTo
}));