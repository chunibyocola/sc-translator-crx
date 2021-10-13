import React from 'react';
import IconFont from '../IconFont';
import { LANG_EN } from '../../constants/langCode';
import { resultToString } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';
import ErrorMessage from '../ErrorMessage';
import { TranslateRequest } from '../../types';
import ListenButton from '../ListenButton';

type TsResultProps = {
    translateRequest: TranslateRequest;
    source: string;
    retry: () => void;
    setText: (text: string) => void;
    insertResult?: (result: string) => void;
};

const TsResult: React.FC<TsResultProps> = ({ translateRequest, source, retry, setText, insertResult }) => {
    return (
        <div className='st-result'>
            {translateRequest.status === 'loading' ?
                <TranslateResultSkeleton /> :
            translateRequest.status === 'init' ?
                getMessage('contentTranslateAfterInput'):
            translateRequest.status === 'error' ?
                <ErrorMessage errorCode={translateRequest.errorCode} retry={retry} /> :
            <>
                <div className='st-result__item-stack'>
                    <span>
                        {resultToString(translateRequest.result.result)}
                        {insertResult && <IconFont
                            className='iconbutton button'
                            iconName='#icon-insert'
                            onClick={() => insertResult(resultToString(translateRequest.result.result))}
                        />}
                        <IconFont
                            className='iconbutton button'
                            iconName='#icon-copy'
                            onClick={() => navigator.clipboard.writeText(resultToString(translateRequest.result.result))}
                        />
                        <ListenButton
                            text={resultToString(translateRequest.result.result)}
                            source={source}
                            from={translateRequest.result.to}
                        />
                    </span>
                </div>
                {translateRequest.result.dict && translateRequest.result.dict.length > 0 && <div className='st-result__item-stack'>
                    {translateRequest.result.dict.map((v, i) => (
                        <div key={i}>{v}</div>
                    ))}
                </div>}
                {translateRequest.result.related && translateRequest.result.from === LANG_EN && <div className='st-result__item-stack'>
                    {getMessage('wordRelated')}: {translateRequest.result.related.map((v, i) => (<span key={`${v}${i}`}>
                        {i !== 0 && ', '}<span className='span-link' onClick={() => setText(v)}>{v}</span>
                    </span>))}
                </div>}
                <div className='st-result__item-stack'>
                    <span className='st-result__text'>{translateRequest.result.text}</span>
                    <IconFont
                        className='iconbutton button'
                        iconName='#icon-copy'
                        onClick={() => navigator.clipboard.writeText(translateRequest.result.text)}
                    />
                    <ListenButton
                        text={translateRequest.result.text}
                        source={source}
                        from={translateRequest.result.from}
                    />
                </div>
                {translateRequest.result.phonetic && translateRequest.result.from === LANG_EN && <div>
                    {translateRequest.result.phonetic}
                </div>}
            </>}
        </div>
    );
};

const TranslateResultSkeleton: React.FC = () => (<div className='skeleton' style={{height: '1.2em', width: '65%'}}></div>);

export default TsResult;