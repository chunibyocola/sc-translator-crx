import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import ErrorMessage from '../../../components/ErrorMessage';
import IconFont from '../../../components/IconFont';
import LanguageSelect from '../../../components/LanguageSelect';
import PanelIconButtonWrapper from '../../../components/PanelIconButtons/PanelIconButtonWrapper';
import SourceSelect from '../../../components/SourceSelect';
import { SCTS_SWITCH_WT_DISPLAY_MODE, SCTS_TOGGLE_PAGE_TRANSLATION_STATE, SCTS_TRANSLATE_CURRENT_PAGE } from '../../../constants/chromeSendMessageTypes';
import { LangCodes, preferredLangCode } from '../../../constants/langCode';
import { webPageTranslateSource as webPageTranslateSourceList } from '../../../constants/translateSource';
import { setLocalStorage } from '../../../public/chrome-call';
import { getMessage } from '../../../public/i18n';
import { getOptions } from '../../../public/options';
import { useOnRuntimeMessage, useOptions } from '../../../public/react-use';
import useEffectOnce from '../../../public/react-use/useEffectOnce';
import { closeWebPageTranslating, errorRetry, startWebPageTranslating, switchWayOfFontsDisplaying } from '../../../public/web-page-translate';
import { DefaultOptions } from '../../../types';
import './style.css';
import Logo from '../../../components/Logo';
import { sendGetSpecifySelectors, sendShouldAutoTranslateThisPage, sendUpdatePageTranslationState } from '../../../public/send';

const wPTI18nCache = {
    switchDisplayModeOfResult: getMessage('contentSwitchDisplayModeOfResult'),
    startWebPageTranslating: getMessage('contentStartWebPageTranslating'),
    closeWebPageTranslating: getMessage('contentCloseWebPageTranslating'),
    restartWebpageTranslating: getMessage('contentRestartWebpageTranslating'),
    enableAutoTranslationOnThisSite: getMessage('contentEnableAutoTranslationOnThisSite'),
    disableAutoTranslationOnThisSite: getMessage('contentDisableAutoTranslationOnThisSite')
};

// WPT means web page transalte
type WPTReducerState = {
    show: boolean;
    source: string;
    targetLanguage: string;
    working: boolean;
    error: string;
    activated: boolean;
    auto: boolean;
    requesting: boolean;
};
type WPTReducerAction = 
| { type: 'active-wpt'; show: boolean; auto: boolean; }
| { type: 'change-error'; error: string; }
| { type: 'process-success'; }
| { type: 'close-wpt'; }
| { type: 'change-source'; source: string; }
| { type: 'change-targer-language'; targetLanguage: string; }
| { type: 'show-control-bar'; }
| { type: 'hide-control-bar'; }
| { type: 'request-start'; }
| { type: 'request-finish'; };

const initWPTState: WPTReducerState = {
    show: false,
    source: '',
    targetLanguage: '',
    working: false,
    error: '',
    activated: false,
    auto: false,
    requesting: false
};

const wPTReducer = (state: WPTReducerState, action: WPTReducerAction): WPTReducerState => {
    switch (action.type) {
        case 'active-wpt':
            return { ...state, show: action.show, error: '', working: false, activated: true, auto: action.auto };
        case 'change-error':
            return { ...state, error: action.error };
        case 'process-success':
            return { ...state, working: true, error: '' };
        case 'close-wpt':
            return { ...state, show: false, working: false, activated: false, auto: false };
        case 'change-source':
            return { ...state, source: action.source };
        case 'change-targer-language':
            return { ...state, targetLanguage: action.targetLanguage };
        case 'show-control-bar':
            return { ...state, show: true };
        case 'hide-control-bar':
            return { ...state, show: false };
        case 'request-start':
            return { ...state, requesting: true };
        case 'request-finish':
            return { ...state, requesting: false };
        default:
            return state;
    }
};

type PickedOptions = Pick<DefaultOptions, 'autoTranslateWebpageHostList' | 'translateRedirectedSameDomainPage'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['autoTranslateWebpageHostList', 'translateRedirectedSameDomainPage'];

const WebPageTranslate: React.FC = () => {
    const [langCodes, setLangCodes] = useState<LangCodes>([]);
    const [langLocal, setLangLocal] = useState<{ [key: string]: string; }>({});

    const [{ show, source, targetLanguage, working, error, activated, auto, requesting }, dispach] = useReducer(wPTReducer, {
        ...initWPTState,
        source: getOptions().webPageTranslateSource,
        targetLanguage: getOptions().webPageTranslateTo
    });

    const { autoTranslateWebpageHostList, translateRedirectedSameDomainPage } = useOptions<PickedOptions>(useOptionsDependency);

    const hostSet = useMemo(() => {
        return new Set(autoTranslateWebpageHostList);
    }, [autoTranslateWebpageHostList]);

    const host = window.location.host;

    const handleError = useCallback((errorReason: string) => {
        errorReason && dispach({ type: 'change-error', error: errorReason });
    }, [dispach]);

    const handleRequestStart = useCallback(() => {
        dispach({ type: 'request-start' });
    }, [dispach]);

    const handleRequestFinish = useCallback(() => {
        dispach({ type: 'request-finish' });
    }, [dispach]);

    const startProcessing = useCallback((force = false) => {
        if (working && !force) { return; }

        closeWebPageTranslating();

        sendGetSpecifySelectors(`${window.location.host}${window.location.pathname}`).then((data) => {
            let specifySelectors = { includeSelectors: '', excludeSelectors: '' };

            if (!('code' in data)) {
                specifySelectors = data;
            }

            const startSuccess = startWebPageTranslating({
                element: document.body,
                translateSource: source,
                targetLanguage,
                enhancement: getOptions().displayModeEnhancement,
                translateDynamicContent: getOptions().translateDynamicContent,
                translateIframeContent: getOptions().translateIframeContent,
                customization: getOptions().comparisonCustomization,
                enableCache: getOptions().enablePageTranslationCache,
                specifySelectors,
                onError: handleError,
                onRequestStart: handleRequestStart,
                onRequestFinish: handleRequestFinish
            });
    
            if (startSuccess) {
                dispach({ type: 'process-success' });
            }
            else {
                dispach({ type: 'change-error', error: 'Process failed!' });
            }
        });
    }, [source, targetLanguage, working, dispach, handleError, handleRequestStart, handleRequestFinish]);

    const activatePageTranslation = useCallback(() => {
        if (!working) {
            dispach({ type: 'active-wpt', show: !(getOptions().webPageTranslateDirectly && getOptions().noControlBarWhileFirstActivating), auto: false });

            getOptions().webPageTranslateDirectly && startProcessing();
        }

        if (!activated) { return; }

        if (!show) {
            dispach({ type: 'show-control-bar' });
            return;
        }

        if ((getOptions().webPageTranslateDirectly || auto) && getOptions().noControlBarWhileFirstActivating) {
            dispach({ type: 'hide-control-bar' });
        }
    }, [working, activated, show, auto, startProcessing]);

    const closePageTranslation = useCallback(() => {
        closeWebPageTranslating();
        dispach({ type: 'close-wpt' });
    }, [dispach]);

    useEffectOnce(() => {
        switchWayOfFontsDisplaying(getOptions().webPageTranslateDisplayMode);

        const auto = getOptions().translateDynamicContent && getOptions().enableAutoTranslateWebpage && getOptions().autoTranslateWebpageHostList.includes(host);

        if (!working) {
            if (auto) {
                dispach({ type: 'active-wpt', show: !getOptions().noControlBarWhileFirstActivating, auto });

                startProcessing();
            }
            else if (getOptions().translateRedirectedSameDomainPage) {
                sendShouldAutoTranslateThisPage(location.host).then((response) => {
                    if (response === 'Yes') {
                        dispach({ type: 'active-wpt', show: !getOptions().noControlBarWhileFirstActivating, auto });

                        startProcessing();
                    }
                });
            }
        }
    });

    useEffect(() => {
        const onMessage = (message: string, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
            if (message === 'Have you activated?') {
                sendResponse(activated ? 'Yes!' : 'No!');
                return true;
            }
            if (message === 'Activate page translation!') {
                activatePageTranslation();
                return false;
            }
            if (message === 'Close page translation!') {
                closePageTranslation();
                return false;
            }
        };

        chrome.runtime.onMessage.addListener(onMessage);

        return () => chrome.runtime.onMessage.removeListener(onMessage)
    }, [activated, activatePageTranslation, closePageTranslation]);

    useEffect(() => {
        setLangCodes(preferredLangCode[getOptions().userLanguage]);

        setLangLocal(preferredLangCode[getOptions().userLanguage].reduce((total: { [key: string]: string; }, current) => {
            total[current['code']] = current['name'];
            return total;
        }, {}));
    }, [source]);

    const worked = useRef(false);
    useEffect(() => {
        if (!translateRedirectedSameDomainPage) { 
            return;
        }

        if (!worked.current && !working) {
            return;
        }

        worked.current = true;

        let timeout: ReturnType<typeof setTimeout>;

        const sendUpdateState = () => {
            sendUpdatePageTranslationState(location.host, working);

            if (working) {
                timeout = setTimeout(sendUpdateState, 15000);
            }
        };

        sendUpdateState();

        return () => {
            clearTimeout(timeout);
        }
    }, [working, translateRedirectedSameDomainPage]);

    useOnRuntimeMessage(({ type }) => {
        switch (type) {
            case SCTS_TRANSLATE_CURRENT_PAGE:
                activatePageTranslation();
                break;
            case SCTS_SWITCH_WT_DISPLAY_MODE:
                working && switchWayOfFontsDisplaying();
                break;
            case SCTS_TOGGLE_PAGE_TRANSLATION_STATE:
                activated ? closePageTranslation() : activatePageTranslation();
                break;
            default: break;
        }
    });

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
            <div className='web-page-translate__content__logo'>
                {requesting ? <span className='spinner' /> : <Logo />}
            </div>
            <div className='web-page-translate__content__division' />
            <SourceSelect
                source={source}
                sourceList={webPageTranslateSourceList.concat(getOptions().customWebpageTranslateSourceList)}
                onChange={source => dispach({ type: 'change-source', source })}
                faviconOnly
            />
            <LanguageSelect
                className='web-page-translate__select border-bottom-select'
                value={targetLanguage}
                langCodes={langCodes}
                langLocal={langLocal}
                onChange={targetLanguage => dispach({ type: 'change-targer-language', targetLanguage })}
                recentLangs={[]}
            />
            <PanelIconButtonWrapper
                onClick={() => {
                    if (!working) { return; }

                    switchWayOfFontsDisplaying();
                }}
                disabled={!working}
                title={wPTI18nCache.switchDisplayModeOfResult}
            >
                <IconFont iconName='#icon-switch' />
            </PanelIconButtonWrapper>
            {!working ? <PanelIconButtonWrapper
                onClick={() => {
                    startProcessing();
                }}
                title={wPTI18nCache.startWebPageTranslating}
            >
                <IconFont iconName='#icon-start' />
            </PanelIconButtonWrapper> : <PanelIconButtonWrapper
                onClick={() => {
                    startProcessing(true);
                }}
                title={wPTI18nCache.restartWebpageTranslating}
            >
                <IconFont iconName='#icon-refresh' />
            </PanelIconButtonWrapper>}
            {getOptions().translateDynamicContent && getOptions().enableAutoTranslateWebpage && <PanelIconButtonWrapper
                onClick={() => {
                    const nextHostSet = new Set(hostSet);
                    nextHostSet.has(host) ? nextHostSet.delete(host) : nextHostSet.add(host);
                    setLocalStorage({ autoTranslateWebpageHostList: [...nextHostSet] });
                }}
                title={hostSet.has(host) ? wPTI18nCache.disableAutoTranslationOnThisSite : wPTI18nCache.enableAutoTranslationOnThisSite}
                iconGrey={!hostSet.has(host)}
            >
                <IconFont iconName='#icon-auto' />
            </PanelIconButtonWrapper>}
            <PanelIconButtonWrapper
                onClick={closePageTranslation}
                title={wPTI18nCache.closeWebPageTranslating}
            >
                <IconFont iconName='#icon-GoX' />
            </PanelIconButtonWrapper>
        </div>
    </div>);
};

export default WebPageTranslate;