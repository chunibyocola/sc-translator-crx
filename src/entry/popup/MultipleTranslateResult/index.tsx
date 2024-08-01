import React from 'react';
import './style.css';
import RawText from '../../../components/RawText';
import LanguageSelection from '../../../components/LanguageSelection';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import { mtLangCode } from '../../../constants/langCode';
import { getMessage } from '../../../public/i18n';
import { useAppDispatch, useEffectOnce, useTranslation } from '../../../public/react-use';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';
import scOptions from '../../../public/sc-options';

const MultipleTranslateResult: React.FC = () => {
    const dispatch = useAppDispatch();

    const {
        state: { translations, text, from, to },
        actions: { setText, setLanguage, retry, addSource, removeSource }
    } = useTranslation();

    useEffectOnce(() => {
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && setText(clipboardText);
            dispatch(callOutPanel());
        };

        scOptions.getInit().autoPasteInTheInputBox && readClipboardText();
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
                languageCodes={mtLangCode}
            />
            <div className='popup-multiple-result scrollbar'>
                {translations.length === 0 ? 
                    <div className='popup-multiple-result__add-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, translateRequest }) => (
                    <MtResult
                        source={source}
                        translateRequest={translateRequest}
                        key={source}
                        remove={() => removeSource(source)}
                        retry={() => retry(source)}
                        setText={setText}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} addSource={addSource} />
        </>
    );
};

export default MultipleTranslateResult;