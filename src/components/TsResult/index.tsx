import React from 'react';
import IconFont from '../IconFont';
import { LANG_EN } from '../../constants/langCode';
import { cn, resultToString } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';
import ErrorMessage from '../ErrorMessage';
import { TranslateRequest } from '../../types';
import ListenButton from '../ListenButton';
import scOptions from '../../public/sc-options';

type TsResultProps = {
    translateRequest: TranslateRequest;
    source: string;
    retry: () => void;
    setText: (text: string) => void;
    insertResult?: (result: string) => void;
};

const TsResult: React.FC<TsResultProps> = ({ translateRequest, source, retry, setText, insertResult }) => {
    const { displayOfTranslation } = scOptions.getInit();

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
                    {translateRequest.result.result.map((item, index) => (<span
                        className={cn(displayOfTranslation.maintainParagraphStructure && 'st-result__paragraph')}
                        key={index}
                    >
                        {item}
                        {index === translateRequest.result.result.length - 1 && (<>
                            {insertResult && <IconFont
                                className='iconbutton button'
                                iconName='#icon-insert'
                                onClick={() => insertResult(resultToString(translateRequest.result.result))}
                            />}
                            <IconFont
                                className='iconbutton button'
                                iconName='#icon-copy'
                                onClick={() => {
                                    const text = displayOfTranslation.maintainParagraphStructure
                                        ? translateRequest.result.result.join('\n\n')
                                        : resultToString(translateRequest.result.result);
                                    navigator.clipboard.writeText(text);
                                }}
                            />
                            <ListenButton
                                text={resultToString(translateRequest.result.result)}
                                source={source}
                                from={translateRequest.result.to}
                            />
                        </>)}
                    </span>))}
                </div>
                {displayOfTranslation.dict && translateRequest.result.dict && translateRequest.result.dict.length > 0 && <div className='st-result__item-stack'>
                    {translateRequest.result.dict.map((v, i) => (
                        <div key={i}>{v}</div>
                    ))}
                </div>}
                {displayOfTranslation.related && translateRequest.result.related && translateRequest.result.from === LANG_EN && <div className='st-result__item-stack'>
                    {getMessage('wordRelated')}: {translateRequest.result.related.map((v, i) => (<span key={`${v}${i}`}>
                        {i !== 0 && ', '}<span className='span-link' onClick={() => setText(v)}>{v}</span>
                    </span>))}
                </div>}
                {displayOfTranslation.example && translateRequest.result.example && translateRequest.result.example.length > 0 && <div className='st-result__item-stack'>
                    {translateRequest.result.example.map((v, i) => (
                        <div key={i}>
                            <IconFont
                                iconName='#icon-quote'
                                style={{cursor: 'default', marginLeft: '0', marginRight: '5px'}}
                            />
                            {v.split(/<\/?b>/).map((v1, i1) => (i1 % 2 === 0 ? v1 : <b key={i1}>{v1}</b>))}
                        </div>
                    ))}
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
                {((displayOfTranslation.phonetic && translateRequest.result.from === LANG_EN)
                    || (displayOfTranslation.phonetic_nonEnglish && translateRequest.result.from !== LANG_EN))
                    && translateRequest.result.phonetic
                    && <div>
                    {translateRequest.result.phonetic}
                </div>}
            </>}
        </div>
    );
};

const TranslateResultSkeleton: React.FC = () => (<div className='skeleton' style={{height: '1.2em', width: '65%'}}></div>);

export default TsResult;