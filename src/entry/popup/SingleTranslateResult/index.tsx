import React from 'react';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { googleLangCode, langCode } from '../../../constants/langCode';
import TsVia from '../../../components/TsVia';
import { getOptions } from '../../../public/options';
import { useAppDispatch, useEffectOnce, useTranslation } from '../../../public/react-use';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';
import TranslateResult from '../../../components/TranslateResult';
import './style.css';

const SingleTranslateResult: React.FC = () => {
    const dispatch = useAppDispatch();

    const {
        state: { translations, text, from, to },
        actions: { setText, setLanguage, retry, changeSource }
    } = useTranslation();

    const { source, translateRequest } = translations[0];

    useEffectOnce(() => {
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && setText(clipboardText);
            dispatch(callOutPanel());
        };

        getOptions().autoPasteInTheInputBox && readClipboardText();
    });

    return (
        <>
            <RawText
                defaultValue={text}
                rawTextTranslate={setText}
            />
            <LanguageSelection
                onChange={setLanguage}
                from={from}
                to={to}
                languageCodes={langCode[source] ?? googleLangCode}
            />
            <div className='single-translation-container'>
                <div className='single-translation'>
                    <TsVia
                        sourceChange={changeSource}
                        source={source}
                        translateRequest={translateRequest}
                    />
                    <div className='single-translation__translation scrollbar'>
                        <TranslateResult
                            translateRequest={translateRequest}
                            source={source}
                            retry={() => retry(source)}
                            setText={setText}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SingleTranslateResult;