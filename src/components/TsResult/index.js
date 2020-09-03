import React, { Fragment } from 'react';
import IconFont from '../IconFont';
import Via from './Via';
import { getI18nMessage } from '../../public/chrome-call';
import { LANG_EN } from '../../constants/langCode';
import { resultToString } from '../../public/utils';
import './style.css';

const TsResult = ({resultObj, status, sourceChange, readText, source, disableSourceChange}) => {
    const {text, result, dict, phonetic, from, to} = resultObj;
    const {requestEnd, requesting, err, errCode} = status;
    
    return (
        <div className='ts-result'>
            {requesting ?
                getI18nMessage('wordRequesting') :
            requestEnd ?
                err ?
                    getI18nMessage(`errorCode_${errCode}`) :
                <Fragment>
                    <div className='tss-result'>
                        <span>
                            {resultToString(result)}
                        </span>
                        <IconFont
                            iconName='#icon-GoUnmute'
                            onClick={() => readText(
                                resultToString(result),
                                {source, from: to}
                            )}
                        />
                    </div>
                    {dict ? dict.map((v, i) => (<div key={i}>{v}</div>)) : ''}
                    <div className='tss-origin-text'>
                        <span className='tss-origin-raw'>{text}</span>
                        <IconFont
                            iconName='#icon-GoUnmute'
                            onClick={() => readText(
                                text,
                                {source, from}
                            )}
                        />
                    </div>
                    {phonetic && from === LANG_EN && <div className='tss-phonetic'>
                        {`[${phonetic}]`}
                    </div>}
                </Fragment>:
            `${getI18nMessage('contentTranslateAfterInput')}`}
            <Via sourceChange={sourceChange} source={source} disableSourceChange={disableSourceChange} />
        </div>
    )
};

export default TsResult;