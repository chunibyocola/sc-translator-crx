import React, { useCallback } from 'react';
import { useOptions } from '../../../public/react-use';
import './style.css';
import PopupHeader from '../../PopupHeader';
import RawText from '../../RawText';
import LanguageSelection from '../../LanguageSelection';
import { mtSetText, mtSetFromAndTo, mtRemoveSource, mtRequestStart, mtRequestFinish, mtRequestError } from '../../../redux/actions/multipleTranslateActions';
import { useDispatch, useSelector } from 'react-redux';
import { sendTranslate, sendAudio } from '../../../public/send';
import MtAddSource from '../MtAddSource';
import MtResult from '../MtResult';
import { getI18nMessage } from '../../../public/chrome-call';
import { mtLangCode } from '../../../constants/langCode';

const MtPopup = () => {
    const { darkMode } = useOptions(['darkMode']);

    const { text, from, to, translations } = useSelector(state => state.multipleTranslateState);

    const dispatch = useDispatch();

    const handleTranslate = useCallback((source) => {
        dispatch(mtRequestStart({ source }));

        sendTranslate(text, { source, from, to }, (result) => {
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
            <div className='ts-mt-content'>
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
                    />
                ))}
            </div>
            <MtAddSource translations={translations} />
        </div>
    );
};

export default MtPopup;