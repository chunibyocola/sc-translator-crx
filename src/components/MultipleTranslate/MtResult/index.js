import React, { useEffect, useState } from 'react';
import './style.css';
import IconFont from '../../IconFont';
import SourceFavicon from '../../SourceFavicon';
import { getI18nMessage } from '../../../public/chrome-call';
import { resultToString } from '../../../public/utils';
import { LANG_EN } from '../../../constants/langCode';

const MtResult = ({ source, status, result, text, translate, remove, readText }) => {
    const [fold, setFold] = useState(false);

    const { requesting, requestEnd, error, errorCode } = status;

    useEffect(() => {
        !requesting && !requestEnd && text && translate();
    }, [requesting, requestEnd, text, translate]);

    return (
        <div className='ts-mt-result'>
            <div
                className='ts-mt-result-head ts-button'
                onClick={() => setFold(!fold)}
            >
                <span className='ts-mt-result-head-source'>
                    <SourceFavicon source={source} />
                    {requestEnd && !error && <IconFont
                        iconName='#icon-GoUnmute'
                        style={{marginLeft: '5px'}}
                        onClick={(e) => { e.stopPropagation(); readText(text, result.from); }}
                    />}
                </span>
                <span className='ts-mt-result-head-icons'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        style={!fold ? {transform: 'rotate(180deg)'} : {}}
                        className='ts-button'
                    />
                    <IconFont
                        iconName='#icon-GoX'
                        onClick={remove}
                        className='ts-button'
                    />
                </span>
            </div>
            <div className={`ts-mt-result-result${fold ? '-fold' : ''}`}>
                {requesting ?
                    getI18nMessage('wordRequesting') :
                !requestEnd ?
                    getI18nMessage('contentTranslateAfterInput') :
                error ?
                    getI18nMessage(`errorCode_${errorCode}`) :
                <>
                    {result.phonetic && result.from === LANG_EN && <div style={{marginBottom: '10px'}}>
                        {`[${result.phonetic}]`}
                    </div>}
                    <div>
                        <span style={{marginRight: '5px'}}>
                            {resultToString(result.result)}
                        </span>
                        <IconFont
                            iconName='#icon-GoUnmute'
                            style={{cursor: 'pointer'}}
                            onClick={() => readText(resultToString(result.result), result.to)}
                        />
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