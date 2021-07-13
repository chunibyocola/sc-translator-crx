import React from 'react';
import IconFont from '../IconFont';
import { LANG_EN } from '../../constants/langCode';
import { resultToString } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';
import ErrorMessage from '../ErrorMessage';
import { TranslateRequest } from '../../types';

type TsResultProps = {
    translateRequest: TranslateRequest;
    readText: (text: string, from: string) => void;
    retry: () => void;
    setText: (text: string) => void;
    insertResult?: (result: string) => void;
};

const TsResult: React.FC<TsResultProps> = ({ translateRequest, readText, retry, setText, insertResult }) => {
    return (
        <div className='ts-result'>
            {translateRequest.status === 'loading' ?
                <TranslateResultSkeleton /> :
            translateRequest.status === 'init' ?
                getMessage('contentTranslateAfterInput'):
            translateRequest.status === 'error' ?
                <ErrorMessage errorCode={translateRequest.errorCode} retry={retry} /> :
            <>
                <div className='tss-result'>
                    <span>
                        {resultToString(translateRequest.result.result)}
                        {insertResult && <IconFont
                            className='ts-iconbutton ts-button'
                            iconName='#icon-insert'
                            onClick={() => insertResult(resultToString(translateRequest.result.result))}
                        />}
                        <IconFont
                            className='ts-iconbutton ts-button'
                            iconName='#icon-copy'
                            onClick={() => navigator.clipboard.writeText(resultToString(translateRequest.result.result))}
                        />
                        <IconFont
                            className='ts-iconbutton ts-button'
                            iconName='#icon-GoUnmute'
                            onClick={() => readText(resultToString(translateRequest.result.result), translateRequest.result.to)}
                        />
                    </span>
                </div>
                {translateRequest.result.dict?.map((v, i) => (<div key={i}>{v}</div>))}
                {translateRequest.result.related && translateRequest.result.from === LANG_EN && <div>
                    {getMessage('wordRelated')}: {translateRequest.result.related.map((v, i) => (<span key={`${v}${i}`}>
                        {i !== 0 && ', '}<span className='span-link' onClick={() => setText(v)}>{v}</span>
                    </span>))}
                </div>}
                <div className='tss-origin-text flex-align-items-center'>
                    <span className='tss-origin-raw'>{translateRequest.result.text}</span>
                    <IconFont
                        className='ts-iconbutton ts-button'
                        iconName='#icon-copy'
                        onClick={() => navigator.clipboard.writeText(translateRequest.result.text)}
                    />
                    <IconFont
                        className='ts-iconbutton ts-button'
                        iconName='#icon-GoUnmute'
                        onClick={() => readText(translateRequest.result.text, translateRequest.result.from)}
                    />
                </div>
                {translateRequest.result.phonetic && translateRequest.result.from === LANG_EN && <div className='tss-phonetic'>
                    {translateRequest.result.phonetic}
                </div>}
            </>}
        </div>
    );
};

const TranslateResultSkeleton: React.FC = () => (<div className='skeleton' style={{height: '1.2em', width: '65%'}}></div>);

export default TsResult;