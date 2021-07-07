import React, { useState } from 'react';
import './style.css';
import IconFont from '../IconFont';
import SourceFavicon from '../SourceFavicon';
import { resultToString } from '../../public/utils';
import { LANG_EN } from '../../constants/langCode';
import { getMessage } from '../../public/i18n';
import ErrorMessage from '../ErrorMessage';
import { TranslateRequest } from '../../types';

type MtResultProps = {
    source: string;
    transalteRequest: TranslateRequest;
    remove: () => void;
    readText: (text: string, from: string) => void;
    retry: () => void;
    setText: (text: string) => void;
    insertResult?: (result: string) => void;
};

const MtResult: React.FC<MtResultProps> = ({ source, transalteRequest, remove, readText, retry, setText, insertResult }) => {
    const [fold, setFold] = useState(false);

    return (
        <div className='ts-mt-result'>
            <div
                className='ts-mt-result-head ts-button flex-justify-content-space-between'
                onClick={() => setFold(!fold)}
            >
                <span className='flex-align-items-center'>
                    <SourceFavicon source={source} />
                    {transalteRequest.status === 'finished' && <>
                        <IconFont
                            className='ts-iconbutton'
                            iconName='#icon-copy'
                            style={{marginLeft: '5px'}}
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(transalteRequest.result.text); }}
                        />
                        <IconFont
                            className='ts-iconbutton'
                            iconName='#icon-GoUnmute'
                            onClick={(e) => { e.stopPropagation(); readText(transalteRequest.result.text, transalteRequest.result.from); }}
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
                {transalteRequest.status === 'loading' ?
                    getMessage('wordRequesting') :
                transalteRequest.status === 'init' ?
                    getMessage('contentTranslateAfterInput') :
                transalteRequest.status === 'error' ?
                    <ErrorMessage errorCode={transalteRequest.errorCode} retry={retry} /> :
                <>
                    {transalteRequest.result.phonetic && transalteRequest.result.from === LANG_EN && <div style={{marginBottom: '10px'}}>
                        {transalteRequest.result.phonetic}
                    </div>}
                    <div className='ts-mt-result-result-container'>
                        <span>
                            {resultToString(transalteRequest.result.result)}
                            {insertResult && <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-insert'
                                onClick={() => insertResult(resultToString(transalteRequest.result.result))}
                            />}
                            <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-copy'
                                onClick={() => navigator.clipboard.writeText(resultToString(transalteRequest.result.result))}
                            />
                            <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-GoUnmute'
                                onClick={() => readText(resultToString(transalteRequest.result.result), transalteRequest.result.to)}
                            />
                        </span>
                    </div>
                    {transalteRequest.result.dict?.map((v, i) => (
                        <div key={i} style={i === 0 ? {marginTop: '10px'} : {}}>{v}</div>
                    ))}
                    {transalteRequest.result.related && transalteRequest.result.from === LANG_EN && <div>
                        {getMessage('wordRelated')}: {transalteRequest.result.related.map((v, i) => (<span key={`${v}${i}`}>
                            {i !== 0 && ', '}<span className='span-link' onClick={() => setText(v)}>{v}</span>
                        </span>))}
                    </div>}
                </>}
            </div>
        </div>
    );
};

export default MtResult;