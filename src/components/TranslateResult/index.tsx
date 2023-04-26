import React from 'react';
import { LANG_EN } from '../../constants/langCode';
import { getMessage } from '../../public/i18n';
import { getOptions } from '../../public/options';
import { classNames, resultToString } from '../../public/utils';
import { TranslateRequest } from '../../types';
import ErrorMessage from '../ErrorMessage';
import IconFont from '../IconFont';
import ListenButton from '../ListenButton';
import './style.css';

type TranslateResultProps = {
    translateRequest: TranslateRequest;
    source: string;
    retry?: () => void;
    insertResult?: (result: string) => void;
    setText?: (text: string) => void;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'style' | 'className'>;

const TranslateResult: React.FC<TranslateResultProps> = ({ translateRequest, source, style, className, retry, insertResult, setText }) => {
    const { displayOfTranslation } = getOptions();

    return (
        <div className={classNames('translate-result', className)} style={style}>
            {translateRequest.status === 'loading' ?
                <TranslateResultSkeleton /> :
            translateRequest.status === 'init' ?
                getMessage('contentTranslateAfterInput') :
            translateRequest.status === 'error' ?
                <ErrorMessage errorCode={translateRequest.errorCode} retry={retry} /> :
            <>
                {((displayOfTranslation.phonetic && translateRequest.result.from === LANG_EN)
                    || (displayOfTranslation.phonetic_nonEnglish && translateRequest.result.from !== LANG_EN))
                    && translateRequest.result.phonetic
                    && <div className='translate-result__item translate-result__phonetic'>
                    {translateRequest.result.phonetic}
                </div>}
                <div className='translate-result__item translate-result__result'>
                    {translateRequest.result.result.map((item, index) => (<span
                        className={classNames(displayOfTranslation.maintainParagraphStructure && 'translate-result__paragraph')}
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
                {displayOfTranslation.dict
                    && translateRequest.result.dict
                    && translateRequest.result.dict.length > 0
                    && <div className='translate-result__item translate-result__dict'>
                    {translateRequest.result.dict.map((v, i) => (
                        <div key={i}>{v}</div>
                    ))}
                </div>}
                {displayOfTranslation.related
                    && translateRequest.result.related
                    && translateRequest.result.from === LANG_EN
                    && <div className='translate-result__item translate-result__related'>
                    {getMessage('wordRelated')}: {translateRequest.result.related.map((v, i) => (<span key={`${v}${i}`}>
                        {i !== 0 && ', '}<span className={setText && 'span-link'} onClick={() => setText?.(v)}>{v}</span>
                    </span>))}
                </div>}
                {displayOfTranslation.example
                    && translateRequest.result.example
                    && translateRequest.result.example.length > 0
                    && <div className='translate-result__item translate-result__example'>
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
            </>}
        </div>
    );
};

const TranslateResultSkeleton: React.FC = () => (<div className='skeleton' style={{height: '1.25em', width: '65%'}}></div>);

export default TranslateResult;