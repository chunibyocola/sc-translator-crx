import React from 'react';
import * as extensionErrors from '../../constants/errorCodes';
import * as translateErrors from '../../public/translate/error-codes';
import { getMessage } from '../../public/i18n';

const errorMessage = {
    [extensionErrors.SOURCE_ERROR]: getMessage(`errorCode_${extensionErrors.SOURCE_ERROR}`),
    [extensionErrors.EXTENSION_UPDATED]: getMessage(`errorCode_${extensionErrors.EXTENSION_UPDATED}`),
    [translateErrors.BAD_REQUEST]: getMessage(`errorCode_${translateErrors.BAD_REQUEST}`),
    [translateErrors.CONNECTION_TIMED_OUT]: getMessage(`errorCode_${translateErrors.CONNECTION_TIMED_OUT}`),
    [translateErrors.LANGUAGE_NOT_SOPPORTED]: getMessage(`errorCode_${translateErrors.LANGUAGE_NOT_SOPPORTED}`),
    [translateErrors.NO_RESULT]: getMessage(`errorCode_${translateErrors.NO_RESULT}`),
    [translateErrors.RESULT_ERROR]: getMessage(`errorCode_${translateErrors.RESULT_ERROR}`)
};

const refreshPageMessage = getMessage('sentenceRefreshPage');

const refreshPage = () => { window.location.reload(); }

const ErrorMessage = ({ errorCode, retry }) => {
    return (
        <span>
            {errorMessage[errorCode] ?? errorCode}
            {(errorCode in translateErrors || !errorMessage[errorCode]) && retry && <span className='span-link' onClick={retry}>{getMessage('wordRetry')}</span>}
            {errorCode === extensionErrors.EXTENSION_UPDATED && <span className='span-link' onClick={refreshPage}>{refreshPageMessage}</span>}
        </span>
    );
};

export default ErrorMessage;