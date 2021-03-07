import React from 'react';
import IconFont from '../IconFont';
import { LANG_EN } from '../../constants/langCode';
import { resultToString } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';

const TsResult = ({ resultObj, status, readText, source, retry }) => {
    const { text, result, dict, phonetic, from, to } = resultObj;
    const { requestEnd, requesting, error, errorCode } = status;
    
    return (
        <div className='ts-result'>
            {requesting ?
                getMessage('wordRequesting') :
            !requestEnd ?
                getMessage('contentTranslateAfterInput'):
            error ?
                <>{getMessage(`errorCode_${errorCode}`)}<span className='span-link' onClick={retry}>{getMessage('wordRetry')}</span></> :
            <>
                <div className='tss-result flex-align-items-center'>
                    <span>
                        {resultToString(result)}
                    </span>
                    <IconFont
                        className='ts-iconbutton ts-button'
                        iconName='#icon-GoUnmute'
                        onClick={() => readText(
                            resultToString(result),
                            { source, from: to }
                        )}
                    />
                </div>
                {dict && dict.map((v, i) => (<div key={i}>{v}</div>))}
                <div className='tss-origin-text flex-align-items-center'>
                    <span className='tss-origin-raw'>{text}</span>
                    <IconFont
                        className='ts-iconbutton ts-button'
                        iconName='#icon-GoUnmute'
                        onClick={() => readText(
                            text,
                            { source, from }
                        )}
                    />
                </div>
                {phonetic && from === LANG_EN && <div className='tss-phonetic'>
                    {phonetic}
                </div>}
            </>}
        </div>
    )
};

export default TsResult;