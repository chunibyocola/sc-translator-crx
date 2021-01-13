import React, { useCallback, useRef } from 'react';
import './style.css';
import RawText from '../../../components/RawText';
import LanguageSelection from '../../../components/LanguageSelection';
import { mtSetText, mtSetFromAndTo, mtRemoveSource, mtRequestStart, mtRequestFinish, mtRequestError, mtRetry } from '../../../redux/actions/multipleTranslateActions';
import { useDispatch, useSelector } from 'react-redux';
import { sendTranslate, sendAudio } from '../../../public/send';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import { mtLangCode } from '../../../constants/langCode';
import { getMessage } from '../../../public/i18n';

const MultipleTranslateResult = () => {
    const { focusRawText } = useSelector(state => state.resultBoxState);

    const { text, from, to, translations, translateId } = useSelector(state => state.multipleTranslateState);

    const translateIdRef = useRef(0);

    const dispatch = useDispatch();

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source) => {
        dispatch(mtRequestStart({ source }));

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            result.suc ? dispatch(mtRequestFinish({ source, result: result.data})) : dispatch(mtRequestError({ source, errorCode: result.data.code }));
        });
    }, [text, from, to, dispatch]);

    const handleRawTextTranslate = useCallback((text) => {
        text && dispatch(mtSetText({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(mtSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRemoveSource = useCallback((source) => {
        dispatch(mtRemoveSource({ source }));
    }, [dispatch]);

    const handleRetry = useCallback((source) => {
        dispatch(mtRetry({ source }));
    }, [dispatch]);

    return (
        <>
            <RawText
                defaultValue={text}
                rawTextTranslate={handleRawTextTranslate}
                focusDependency={focusRawText}
            />
            <LanguageSelection
                selectionChange={handleSelectionChange}
                from={from}
                to={to}
                options={mtLangCode}
            />
            <div className='ts-mt-results ts-scrollbar'>
                {translations.length === 0 ? 
                    <div className='ts-mt-result-add-translate-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, status, result }) => (
                    <MtResult
                        source={source}
                        status={status}
                        result={result}
                        key={source}
                        text={text}
                        translate={() => handleTranslate(source)}
                        remove={() => handleRemoveSource(source)}
                        readText={(text, from) => sendAudio(text, { source, from })}
                        retry={() => handleRetry(source)}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} />
        </>
    );
};

export default MultipleTranslateResult;