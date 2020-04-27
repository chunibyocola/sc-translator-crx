import React, {Fragment} from 'react';
import IconFont from '../IconFont';
import Via from './Via';
import {getContentText} from '../../public/localization';
import {LANG_EN} from '../../constants/langCode';
import './style.css';

const resultToString = result => result.reduce((t, c) => (t + c), '');

const TsResult = ({resultObj, status, sourceChange, readText, source, disableSourceChange}) => {
    const {text, result, dict, phonetic, from, to} = resultObj;
    const {requestEnd, requesting, err, errCode} = status;
    
    return (
        <div className='ts-result'>
            {
                requesting?
                    'Requesting...':
                    requestEnd?
                        err?
                            errCode:
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
                                {dict? dict.map((v, i) => (
                                    <div key={i}>{v}</div>
                                )): ''}
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
                                {
                                    phonetic && from === LANG_EN &&
                                    <div className='tss-phonetic'>
                                        {`[${phonetic}]`}
                                    </div>
                                }
                            </Fragment>:
                        `${getContentText('translateAfterInput')}`
            }
            <Via sourceChange={sourceChange} source={source} disableSourceChange={disableSourceChange} />
        </div>
    )
};

export default TsResult;