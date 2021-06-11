import React, { useState } from 'react';
import './style.css';
import IconFont from '../IconFont';
import SourceFavicon from '../SourceFavicon';
import { resultToString } from '../../public/utils';
import { LANG_EN } from '../../constants/langCode';
import { getMessage } from '../../public/i18n';
import ErrorMessage from '../ErrorMessage';

const MtResult = ({ source, status, result, text, remove, readText, retry, setText, insertResult }) => {
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
                    {requestEnd && !error && <>
                        <IconFont
                            className='ts-iconbutton'
                            iconName='#icon-copy'
                            style={{marginLeft: '5px'}}
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(text); }}
                        />
                        <IconFont
                            className='ts-iconbutton'
                            iconName='#icon-GoUnmute'
                            onClick={(e) => { e.stopPropagation(); readText(text, result.from); }}
                        />
                    </>}
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
                    <ErrorMessage errorCode={errorCode} retry={retry} /> :
                <>
                    {result.phonetic && result.from === LANG_EN && <div style={{marginBottom: '10px'}}>
                        {result.phonetic}
                    </div>}
                    <div className='ts-mt-result-result-container'>
                        <span>
                            {resultToString(result.result)}
                            {insertResult && <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-insert'
                                onClick={() => insertResult(resultToString(result.result))}
                            />}
                            <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-copy'
                                onClick={() => navigator.clipboard.writeText(resultToString(result.result))}
                            />
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
                    {result.related && result.from === LANG_EN && <div>
                        {getMessage('wordRelated')}: {result.related.map((v, i) => (<span key={`${v}${i}`}>
                            {i !== 0 && ', '}<span className='span-link' onClick={() => setText(v)}>{v}</span>
                        </span>))}
                    </div>}
                </>}
            </div>
        </div>
    );
};

export default MtResult;