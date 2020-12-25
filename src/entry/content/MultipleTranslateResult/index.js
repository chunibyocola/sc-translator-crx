import React, { useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mtRequestStart, mtRequestFinish, mtRequestError, mtRemoveSource, mtSetText, mtSetFromAndTo, mtRetry } from '../../../redux/actions/multipleTranslateActions';
import MtResult from '../../../components/MtResult';
import MtAddSource from '../../../components/MtAddSource';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { sendTranslate, sendAudio } from '../../../public/send';
import { getI18nMessage } from '../../../public/chrome-call';
import { mtLangCode } from '../../../constants/langCode';
import './style.css';

const MultipleTranslateResult = ({ showRtAndLs }) => {
    const translateIdRef = useRef(0);

    const { focusRawText } = useSelector(state => state.resultBoxState);
    const { text, from, to, translations, translateId } = useSelector(state => state.multipleTranslateState);

    const dispatch = useDispatch();

    translateIdRef.current = translateId;

    const handleTranslate = useCallback((source) => {
        dispatch(mtRequestStart({ source }));

        sendTranslate(text, { source, from, to, translateId: translateIdRef.current }, (result) => {
            if (result.translateId !== translateIdRef.current) { return; }

            result.suc ? dispatch(mtRequestFinish({ source, result: result.data})) : dispatch(mtRequestError({ source, errorCode: result.data.code }));
        });
    }, [text, from, to, dispatch]);

    const handleRemoveSource = useCallback((source) => {
        dispatch(mtRemoveSource({ source }));
    }, [dispatch]);

    const handleRawTextChange = useCallback((text) => {
        text && dispatch(mtSetText({ text }));
    }, [dispatch]);

    const handleSelectionChange = useCallback((from, to) => {
        dispatch(mtSetFromAndTo({ from, to }));
    }, [dispatch]);

    const handleRetry = useCallback((source) => {
        dispatch(mtRetry({ source }));
    }, [dispatch]);

    return (
        <>
            <div style={{display: showRtAndLs ? 'block' : 'none'}}>
                <RawText
                    defaultValue={text}
                    rawTextTranslate={handleRawTextChange}
                    focusDependency={focusRawText}
                />
                <LanguageSelection
                    selectionChange={handleSelectionChange}
                    from={from}
                    to={to}
                    options={mtLangCode}
                />
            </div>
            <div className='ts-mt-results ts-scrollbar'>
                {translations.length === 0 ? 
                    <div className='ts-mt-result-add-translate-source'>{getI18nMessage('sentenceAddTranslateSource')}</div> :
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