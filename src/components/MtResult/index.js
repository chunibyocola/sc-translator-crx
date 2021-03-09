import React, { useState } from 'react';
import './style.css';
import IconFont from '../IconFont';
import SourceFavicon from '../SourceFavicon';
import { resultToString } from '../../public/utils';
import { LANG_EN } from '../../constants/langCode';
import { getMessage } from '../../public/i18n';

const MtResult = ({ source, status, result, text, remove, readText, retry }) => {
    const [fold, setFold] = useState(false);

    const { requesting, requestEnd, error, errorCode } = status;

    return (
        <div className='ts-mt-result'>
            <div
                className='ts-mt-result-head ts-button flex-justify-content-space-between'
                onClick={() => setFold(!fold)}
            >
                <span className='flex-align-items-center'>
                    <SourceFavicon source={source} />
                    {requestEnd && !error && <IconFont
                        className='ts-iconbutton'
                        iconName='#icon-GoUnmute'
                        style={{marginLeft: '5px'}}
                        onClick={(e) => { e.stopPropagation(); readText(text, result.from); }}
                    />}
                </span>
                <span className='ts-mt-result-head-icons flex-align-items-center'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        style={!fold ? {transform: 'rotate(180deg)'} : {}}
                    />
                    <IconFont
                        iconName='#icon-GoX'
                        onClick={remove}
                        className='ts-iconbutton'
                    />
                </span>
            </div>
            <div className='ts-dividing-line' style={fold ? {display: 'none'} : {}}></div>
            <div className='ts-mt-result-result' style={fold ? {display: 'none'} : {}}>
                {requesting ?
                    getMessage('wordRequesting') :
                !requestEnd ?
                    getMessage('contentTranslateAfterInput') :
                error ?
                    <>{getMessage(`errorCode_${errorCode}`)}<span className='span-link' onClick={retry}>{getMessage('wordRetry')}</span></> :
                <>
                    {result.phonetic && result.from === LANG_EN && <div style={{marginBottom: '10px'}}>
                        {result.phonetic}
                    </div>}
                    <div className='ts-mt-result-result-container'>
                        <span>
                            {resultToString(result.result)}
                            <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-GoUnmute'
                                onClick={() => readText(resultToString(result.result), result.to)}
                            />
                        </span>
                    </div>
                    {result.dict && result.dict.map((v, i) => (
                        <div key={i} style={i === 0 ? {marginTop: '10px'} : {}}>{v}</div>
                    ))}
                </>}
            </div>
        </div>
    );
};

export default MtResult;