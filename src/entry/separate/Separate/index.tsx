import React, { useEffect } from 'react';
import LanguageSelection from '../../../components/LanguageSelection';
import MtAddSource from '../../../components/MtAddSource';
import MtResult from '../../../components/MtResult';
import RawText from '../../../components/RawText';
import { mtLangCode } from '../../../constants/langCode';
import { setLocalStorage } from '../../../public/chrome-call';
import './style.css';
import '../../../components/PopupHeader/style.css';
import { useAppDispatch, useEffectOnce, useOptions, useTranslation } from '../../../public/react-use';
import { getMessage } from '../../../public/i18n';
import { getOptions } from '../../../public/options';
import { GetStorageKeys } from '../../../types';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';
import CollectButton from '../../../components/PanelIconButtons/CollectButton';
import OpenOptionsPageButton from '../../../components/PanelIconButtons/OpenOptionsPageButton';
import SwitchThemeButton from '../../../components/PanelIconButtons/SwitchThemeButton';
import OpenCollectionPageButton from '../../../components/PanelIconButtons/OpenCollectionPageButton';

const useOptionsDependency: GetStorageKeys<'rememberStwSizeAndPosition'> = ['rememberStwSizeAndPosition'];

const Separate: React.FC = () => {
    const dispatch = useAppDispatch();

    const {
        state: { text, from, to, translations },
        actions: { setText, setLanguage, removeSource, retry, addSource }
    } = useTranslation();

    const { rememberStwSizeAndPosition } = useOptions(useOptionsDependency);

    useEffectOnce(() => {
        const text = new URL(window.location.href).searchParams.get('text');
        text && setText(text);

        // read clipboard
        const readClipboardText = async () => {
            const clipboardText = await navigator.clipboard.readText();
            clipboardText && setText(clipboardText);
            dispatch(callOutPanel());
        };

        if (getOptions().autoPasteInTheInputBox && !text) {
            readClipboardText();
        }
        else {
            dispatch(callOutPanel());
        }
    });

    useEffect(() => {
        if (!rememberStwSizeAndPosition) { return; }

        const onBeforeUnload = () => {
            const sizeAndPosition = {
                width: window.outerWidth,
                height: window.outerHeight,
                left: window.screenX,
                top: window.screenY
            };

            setLocalStorage({ 'stwSizeAndPosition': sizeAndPosition });
        };

        window.addEventListener('beforeunload', onBeforeUnload);

        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [rememberStwSizeAndPosition]);

    return (
        <div id="sc-translator-root" className='separate-container'>
            <div className="popup-header flex-justify-content-space-between">
                <div className='popup-header__logo flex-align-items-center'></div>
                <div className='popup-header__icons flex-align-items-center'>
                    <CollectButton />
                    <OpenCollectionPageButton />
                    <SwitchThemeButton />
                    <OpenOptionsPageButton />
                </div>
            </div>
            <div className="separate-container__content">
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
                <div className='separate-container__multiple-result scrollbar'>
                    {translations.length === 0 ? 
                        <div className='separate-container__add-source'>{getMessage('sentenceAddTranslateSource')}</div> :
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
            </div>
        </div>
    );
};

export default Separate;