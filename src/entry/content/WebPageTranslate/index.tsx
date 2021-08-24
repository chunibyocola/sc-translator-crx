import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import ErrorMessage from '../../../components/ErrorMessage';
import IconFont from '../../../components/IconFont';
import LanguageSelect from '../../../components/LanguageSelect';
import SourceSelect from '../../../components/SourceSelect';
import { SCTS_TRANSLATE_CURRENT_PAGE } from '../../../constants/chromeSendMessageTypes';
import { LangCodes, preferredLangCode } from '../../../constants/langCode';
import { webPageTranslateSource as webPageTranslateSourceList } from '../../../constants/translateSource';
import { getMessage } from '../../../public/i18n';
import { getOptions } from '../../../public/options';
import { useOnExtensionMessage } from '../../../public/react-use';
import useEffectOnce from '../../../public/react-use/useEffectOnce';
import { closeWebPageTranslating, errorRetry, startWebPageTranslating, switchWayOfFontsDisplaying } from '../../../public/web-page-translate';
import './style.css';

const wPTI18nCache = {
    switchDisplayModeOfResult: getMessage('contentSwitchDisplayModeOfResult'),
    startWebPageTranslating: getMessage('contentStartWebPageTranslating'),
    closeWebPageTranslating: getMessage('contentCloseWebPageTranslating')
};

// WPT means web page transalte
type WPTReducerState = {
    show: boolean;
    source: string;
    targetLanguage: string;
    working: boolean;
    error: string;
};
type WPTReducerAction = 
| { type: 'init'; source: string; targetLanguage: string; }
| { type: 'active-wpt'; }
| { type: 'change-error'; error: string; }
| { type: 'process-success'; }
| { type: 'close-wpt'; }
| { type: 'change-source'; source: string; }
| { type: 'change-targer-language'; targetLanguage: string; };

const initWPTState: WPTReducerState = {
    show: false,
    source: '',
    targetLanguage: '',
    working: false,
    error: ''
};

const wPTReducer = (state: WPTReducerState, action: WPTReducerAction): WPTReducerState => {
    switch (action.type) {
        case 'init':
            return { ...state, source: action.source, targetLanguage: action.targetLanguage };
        case 'active-wpt':
            return { ...state, show: true, error: '', working: false };
        case 'change-error':
            return { ...state, error: action.error };
        case 'process-success':
            return { ...state, working: true };
        case 'close-wpt':
            return { ...state, show: false, working: false };
        case 'change-source':
            return { ...state, source: action.source };
        case 'change-targer-language':
            return { ...state, targetLanguage: action.targetLanguage };
        default:
            return state;
    }
};

const WebPageTranslate: React.FC = () => {
    const [langCodes, setLangCodes] = useState<LangCodes>([]);
    const [langLocal, setLangLocal] = useState<{ [key: string]: string; }>({});
    const [workingSourceAndLanguage, setWorkingSourceAndLanguage] = useState({ source: '', targetLanguage: '' });

    const [{ show, source, targetLanguage, working, error }, dispach] = useReducer(wPTReducer, initWPTState);

    const handleError = useCallback((errorReason: string) => {
        errorReason && dispach({ type: 'change-error', error: errorReason });
    }, [dispach]);

    useEffectOnce(() => {
        dispach({ type: 'init', source: getOptions().webPageTranslateSource, targetLanguage: getOptions().webPageTranslateTo });

        switchWayOfFontsDisplaying(getOptions().webPageTranslateDisplayMode);
    });

    useEffect(() => {
        setLangCodes(preferredLangCode[getOptions().userLanguage]);

        setLangLocal(preferredLangCode[getOptions().userLanguage].reduce((total: { [key: string]: string; }, current) => {
            total[current['code']] = current['name'];
            return total;
        }, {}));
    }, [source]);

    const oldChromeMsg = useRef<any>(null);

    const chromeMsg = useOnExtensionMessage();

    const startProcessing = useCallback(() => {
        if (source === workingSourceAndLanguage.source && targetLanguage === workingSourceAndLanguage.targetLanguage) { return; }

        closeWebPageTranslating();
        const startSuccess = startWebPageTranslating(document.body, source, targetLanguage, handleError);
        if (startSuccess) {
            setWorkingSourceAndLanguage({ source, targetLanguage });
            dispach({ type: 'process-success' });
        }
        else {
            dispach({ type: 'change-error', error: 'Process failed!' });
        }
    }, [source, targetLanguage, workingSourceAndLanguage, dispach, handleError]);

    useEffect(() => {
        if (oldChromeMsg.current === chromeMsg) { return; }

        const { type } = chromeMsg;

        switch (type) {
            case SCTS_TRANSLATE_CURRENT_PAGE:
                if (!working) {
                    dispach({ type: 'active-wpt' });

                    getOptions().webPageTranslateDirectly && startProcessing();
                }
                break;
            default: break;
        }

        oldChromeMsg.current = chromeMsg;
    }, [chromeMsg, working, dispach, startProcessing]);

    return (<div className='web-page-translate'
        style={show ? {} : {display: 'none'}}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
    >
        {error && <div className='web-page-translate__error'>
            <ErrorMessage
                errorCode={error}
                retry={() => {
                    errorRetry();
                    dispach({ type: 'change-error', error: '' });
                }}
            />
        </div>}
        <div className='web-page-translate__content flex-align-items-center'>
            <SourceSelect
                className='web-page-translate__select border-bottom-select'
                source={source}
                sourceList={webPageTranslateSourceList}
                onChange={source => dispach({ type: 'change-source', source })}
            />
            <LanguageSelect
                className='web-page-translate__select border-bottom-select'
                value={targetLanguage}
                langCodes={langCodes}
                langLocal={langLocal}
                onChange={targetLanguage => dispach({ type: 'change-targer-language', targetLanguage })}
                recentLangs={[]}
            />
            <IconFont
                iconName='#icon-switch'
                className={working ? 'iconfont--enable' : 'iconfont--disable'}
                title={wPTI18nCache.switchDisplayModeOfResult}
                onClick={() => {
                    if (!working) { return; }

                    switchWayOfFontsDisplaying();
                }}
            />
            <IconFont
                iconName='#icon-start'
                className={source === workingSourceAndLanguage.source && targetLanguage === workingSourceAndLanguage.targetLanguage ? 'iconfont--disable' : 'iconfont--enable'}
                title={wPTI18nCache.startWebPageTranslating}
                onClick={startProcessing}
            />
            <IconFont
                iconName='#icon-GoX'
                className='iconfont--enable'
                title={wPTI18nCache.closeWebPageTranslating}
                onClick={() => {
                    closeWebPageTranslating();
                    setWorkingSourceAndLanguage({ source: '', targetLanguage: '' });
                    dispach({ type: 'close-wpt' });
                }}
            />
        </div>
    </div>);
};

export default WebPageTranslate;