import React, { useEffect, useMemo, useState } from 'react';
import { getMessage } from '../../public/i18n';
import { cn, resultToString } from '../../public/utils';
import { TranslateRequest } from '../../types';
import IconFont from '../IconFont';
import ListenButton from '../ListenButton';
import scOptions from '../../public/sc-options';
import scBrowserAI from '../../public/sc-browser-ai';
import { langCodeI18n } from '../../constants/langCode';

type TranslateResultProps = {
    translateRequest: TranslateRequest;
    source: string;
    retry: () => void;
    insertResult?: (result: string) => void;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'style' | 'className'>;

const BrowserAIResult: React.FC<TranslateResultProps> = ({ translateRequest, source, style, className, retry, insertResult }) => {
    const { displayOfTranslation } = scOptions.getInit();

    return (
        <div className={cn('translate-result', className)} style={style}>
            {translateRequest.status === 'loading' ? (
                <TranslateResultSkeleton />
            ) : translateRequest.status === 'init' ? (
                <span>{getMessage('contentTranslateAfterInput')}</span>
            ) : translateRequest.status === 'error' ? (
                <BrowserAIError message={translateRequest.errorCode} retry={retry} />
            ) : (
                <div className='translate-result__item translate-result__result'>
                    {translateRequest.result.result.map((item, index) => (<span
                        className={cn(displayOfTranslation.maintainParagraphStructure && 'translate-result__paragraph')}
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
            )}
        </div>
    );
};

const getLangCodeI18n = (code: string) => {
    return langCodeI18n[scOptions.getInit().userLanguage][code] ?? code;
};

type BrowserAIErrorProps = {
    message: string;
    retry: () => void;
}
const BrowserAIError: React.FC<BrowserAIErrorProps> = ({ message, retry }) => {
    const errorParams = useMemo(() => {
        const searchParams = new URLSearchParams(message);
        const target = searchParams.get('target');
        const availability = searchParams.get('availability');
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        return { target, availability, from, to };
    }, [message]);

    const [downloadLoaded, setDownloadLoaded] = useState('');

    useEffect(() => {
        setDownloadLoaded('');
    }, [message]);

    if (message === 'unavailable') {
        return (
            <div>{getMessage('browserAIUnavailable')}</div>
        );
    }

    if (!errorParams.target || !errorParams.availability) {
        return (
            <div>Unknown: {message}</div>
        );
    }

    if (errorParams.target === 'LanguageDetector') {
        let errorMessage = `[${errorParams.target}] ${getMessage(errorParams.availability)}`;

        let modelMessage = '';
        if (errorParams.availability === 'downloadable') {
            modelMessage = ` [Model(LanguageDetector)] ${getMessage(errorParams.availability)}`;
        }
        else if (errorParams.availability === 'downloading') {
            modelMessage = ` [Model(LanguageDetector)] ${getMessage(errorParams.availability)}`;
        }

        let loadedMessage = '';
        if (downloadLoaded) {
            loadedMessage = ` [Loaded] ${downloadLoaded}`;
        }

        return (
            <div>
                <div>{errorMessage}</div>
                <div>{modelMessage}</div>
                <div>{loadedMessage}</div>
                {errorParams.availability === 'downloadable' && <div>
                    <span
                        className='span-link'
                        onClick={async () => {
                            try {
                                await scBrowserAI.downloadDetector({ loaded: loaded => setDownloadLoaded(loaded) });

                                retry();
                            }
                            catch (e) {
                                setDownloadLoaded('Error: ' + (e as Error).message);
                            }
                        }}
                    >
                        {getMessage('download')}
                    </span>
                </div>}
            </div>
        );
    }

    if (errorParams.target === 'Translator') {
        let errorMessage = `[${errorParams.target}] ${getMessage(errorParams.availability)}`;

        let modelMessage = '';
        if (errorParams.from && errorParams.to) {
            modelMessage = `[Model(${getLangCodeI18n(errorParams.from)} → ${getLangCodeI18n(errorParams.to)})] ${getMessage(errorParams.availability)}`;
        }

        let loadedMessage = '';
        if (downloadLoaded) {
            loadedMessage += ` [Loaded] ${downloadLoaded}`;
        }

        return (
            <div>
                <div>{errorMessage}</div>
                <div>{modelMessage}</div>
                <div>{loadedMessage}</div>
                {errorParams.availability === 'downloadable' && errorParams.from && errorParams.to && !downloadLoaded && <div>
                    <span
                        className='span-link'
                        onClick={async () => {
                            if (!errorParams.from || !errorParams.to) { return; }

                            try {
                                await scBrowserAI.downloadTranslator({
                                    sourceLanguage: errorParams.from,
                                    targetLanguage: errorParams.to,
                                    loaded: loaded => setDownloadLoaded(loaded)
                                });

                                retry();
                            }
                            catch (e) {
                                setDownloadLoaded('Error: ' + (e as Error).message);
                            }
                        }}
                    >
                        {getMessage('download')}
                    </span>
                </div>}
            </div>
        );
    }

    return (
        <div>{message}</div>
    );
};

const TranslateResultSkeleton: React.FC = () => (<div className='skeleton' style={{height: '1.25em', width: '65%'}}></div>);

export default BrowserAIResult;