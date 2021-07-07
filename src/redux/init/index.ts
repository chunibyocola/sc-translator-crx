import { mtInit } from '../slice/multipleTranslateSlice';
import { stInit } from '../slice/singleTranslateSlice';
import { getDispatch } from '../store';

export const initMultipleTranslate = ({
    multipleTranslateSourceList = [],
    multipleTranslateFrom = '',
    multipleTranslateTo = ''
}: {
    multipleTranslateSourceList: string[];
    multipleTranslateFrom: string;
    multipleTranslateTo: string;
}) => getDispatch()(mtInit({
    sourceList: multipleTranslateSourceList,
    from: multipleTranslateFrom,
    to: multipleTranslateTo
}));

export const initSingleTranslate = ({
    defaultTranslateSource = 'google.com',
    defaultTranslateFrom = '',
    defaultTranslateTo = ''
}) => getDispatch()(stInit({
    source: defaultTranslateSource,
    from: defaultTranslateFrom,
    to: defaultTranslateTo
}));