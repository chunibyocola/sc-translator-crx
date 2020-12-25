import React, { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconFont from '../../../components/IconFont';
import LanguageSelection from '../../../components/LanguageSelection';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import RawText from '../../../components/RawText';
import { mtLangCode } from '../../../constants/langCode';
import { getI18nMessage, openOptionsPage, setLocalStorage } from '../../../public/chrome-call';
import { sendAudio, sendTranslate } from '../../../public/send';
import { mtRemoveSource, mtRequestError, mtRequestFinish, mtRequestStart, mtRetry, mtSetFromAndTo, mtSetText } from '../../../redux/actions/multipleTranslateActions';
import './style.css';
import '../../../components/PopupHeader/style.css';
import { useOptions } from '../../../public/react-use';

const useOptionsDependency = ['styleVarsList', 'styleVarsIndex'];

const Separate = () => {
    const { text, from, to, translations, translateId } = useSelector(state => state.multipleTranslateState);
    const { focusRawText } = useSelector(state => state.resultBoxState);

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

    const { styleVarsList, styleVarsIndex } = useOptions(useOptionsDependency);

    const handleThemeToggle = useCallback(() => {
        setLocalStorage({'styleVarsIndex': styleVarsIndex >= styleVarsList.length - 1 ? 0 : styleVarsIndex + 1});
    }, [styleVarsList, styleVarsIndex]);

    return (
        <div id="sc-translator-root" className='container'>
            <div className="title">
                <div className='title-logo'>Sc</div>
                <div className='title-icons'>
                    <IconFont
                        iconName='#icon-theme'
                        className='title-icons-enable'
                        onClick={() => handleThemeToggle()}
                        title={getI18nMessage('popupSwitchToTheNextTheme')}
                    />
                    <IconFont
                        iconName='#icon-MdSettings'
                        className='title-icons-enable'
                        onClick={openOptionsPage}
                        title={getI18nMessage('popupOpenOptionsPage')}
                    />
                </div>
            </div>
            <div className="content">
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
        </div>
    );
};

export default Separate;