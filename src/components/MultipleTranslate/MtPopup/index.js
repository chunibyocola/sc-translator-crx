import React, { useCallback, useRef } from 'react';
import { useOptions } from '../../../public/react-use';
import './style.css';
import PopupHeader from '../../PopupHeader';
import RawText from '../../RawText';
import LanguageSelection from '../../LanguageSelection';
import { mtSetText, mtSetFromAndTo, mtRemoveSource, mtRequestStart, mtRequestFinish, mtRequestError, mtRetry } from '../../../redux/actions/multipleTranslateActions';
import { useDispatch, useSelector } from 'react-redux';
import { sendTranslate, sendAudio } from '../../../public/send';
import MtAddSource from '../MtAddSource';
import MtResult from '../MtResult';
import { getI18nMessage } from '../../../public/chrome-call';
import { mtLangCode } from '../../../constants/langCode';

const MtPopup = () => {
    const { darkMode } = useOptions(['darkMode']);

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
        <div id="sc-translator-root" className={`container ${darkMode ? 'dark' : 'light'}`}>
            <PopupHeader />
            <div className="content">
                <RawText rawTextTranslate={handleRawTextTranslate} />
                <LanguageSelection
                    selectionChange={handleSelectionChange}
                    from={from}
                    to={to}
                    options={mtLangCode}
                />
            </div>
            <div className='ts-mt-content ts-scrollbar'>
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
        </div>
    );
};

export default MtPopup;