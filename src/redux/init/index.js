import {getStoreDispatch} from '../store';
import {translationUpdate} from '../actions/translationActions';

export const initTranslation = ({
    defaultTranslateSource = 'google.com',
    defaultTranslateFrom = '',
    defaultTranslateTo = ''
}) => getStoreDispatch()(translationUpdate(
    defaultTranslateSource,
    defaultTranslateFrom,
    defaultTranslateTo
));