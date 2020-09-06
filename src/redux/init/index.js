import { getStoreDispatch } from '../store';
import { mtInit } from '../actions/multipleTranslateActions';
import { stInit } from '../actions/singleTranslateActions';

export const initMultipleTranslate = ({
    multipleTranslateSourceList = [],
    multipleTranslateFrom = '',
    multipleTranslateTo = ''
}) => getStoreDispatch()(mtInit({
    sourceList: multipleTranslateSourceList,
    from: multipleTranslateFrom,
    to: multipleTranslateTo
}));

export const initSingleTranslate = ({
    defaultTranslateSource = 'google.com',
    defaultTranslateFrom = '',
    defaultTranslateTo = ''
}) => getStoreDispatch()(stInit({
    source: defaultTranslateSource,
    from: defaultTranslateFrom,
    to: defaultTranslateTo
}));