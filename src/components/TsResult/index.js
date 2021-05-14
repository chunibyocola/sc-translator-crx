import React from 'react';
import IconFont from '../IconFont';
import { LANG_EN } from '../../constants/langCode';
import { resultToString } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';
import ErrorMessage from '../ErrorMessage';

const TsResult = ({ resultObj, status, readText, source, retry, setText }) => {
    const { text, result, dict, phonetic, from, to, related } = resultObj;
    const { requestEnd, requesting, error, errorCode } = status;
    
    return (
        <div className='ts-result'>
            {requesting ?
                getMessage('wordRequesting') :
            !requestEnd ?
                getMessage('contentTranslateAfterInput'):
            error ?
                <ErrorMessage errorCode={errorCode} retry={retry} /> :
            <>
                <div className='tss-result'>
                    <span>
                        {resultToString(result)}
                        <IconFont
                            className='ts-iconbutton ts-button'
                            iconName='#icon-GoUnmute'
                            onClick={() => readText(
                                resultToString(result),
                                { source, from: to }
                            )}
                        />
                    </span>
                </div>
                {dict && dict.map((v, i) => (<div key={i}>{v}</div>))}
                {related && from === LANG_EN && <div>
                    {getMessage('wordRelated')}: {related.map((v, i) => (<span key={`${v}${i}`}>
                        {i !== 0 && ', '}<span className='span-link' onClick={() => setText(v)}>{v}</span>
                    </span>))}
                </div>}
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