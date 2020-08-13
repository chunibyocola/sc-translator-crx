import React, {useCallback, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import LanguageSelection from '../LanguageSelection';
import { translationUpdate } from '../../redux/actions/translationActions';
import {
    startRequest,
    finishRequest,
    errorRequest
} from '../../redux/actions/tsResultActions';
import {sendAudio, sendTranslate} from '../../public/send';
import IconFont from '../IconFont';
import RawText from '../RawText';
import TsResult from '../TsResult';
import {openOptionsPage, setLocalStorage} from '../../public/chrome-call';
import {useOptions, useIsEnable} from '../../public/react-use';
import {getCurrentTabHost, getIsContentScriptEnabled, getCurrentTab} from '../../public/utils';
import {getI18nMessage} from '../../public/chrome-call';
import './style.css';

const Popup = () => {
    const [isContentScriptEnabled, setIsContentScriptEnabled] = useState(false);

    const isEnableTranslate = useIsEnable('translate');
    const isEnableHistory = useIsEnable('history');

    const {
        translateBlackListMode,
        translateHostList,
        historyBlackListMode,
        historyHostList,
        darkMode
    } = useOptions([
        'translateBlackListMode',
        'translateHostList',
        'historyBlackListMode',
        'historyHostList',
        'darkMode'
    ]);

    const {
        requestEnd,
        requesting,
        err,
        errCode,
        resultObj
    } = useSelector(state => state.tsResultState);

    const translationState = useSelector(state => state.translationState);

    const dispatch = useDispatch();

    const handleDarkModeToggle = useCallback(
        (daMode) => {
            setLocalStorage({'darkMode': !daMode});
        },
        []
    )

    const handleIsEnableToggle = useCallback(
        (list, bMode, isEnable, key) => {
            getCurrentTabHost((host) => {
                if ((isEnable && !bMode) || (!isEnable && bMode)) {
                    const indexArr = list.reduce((t, v, i) => (
                        host.endsWith(v)? t.concat(i): t
                    ), []).reverse();
                    indexArr.map((v) => (list.splice(v, 1)));
                    setLocalStorage({[key]: list});
                }
                else {
                    list.push(host);
                    setLocalStorage({[key]: list});
                }
            });
        },
        []
    );

    const handleTranslate = useCallback(
        (text, translation) => {
            dispatch(startRequest());

            sendTranslate(text, translation, (result) => {
                if (result.suc) dispatch(finishRequest(result.data));
                else dispatch(errorRequest(result.data.code));
            })
        },
        [dispatch]
    );

    const handleSourceChange = useCallback(
        (source) => {
            if (source !== translationState.source) {
                dispatch(translationUpdate(source, '', ''));
                if (resultObj.text) {
                    handleTranslate(resultObj.text, { source, from: '', to: '' });
                }
            }
        },
        [dispatch, translationState, resultObj.text, handleTranslate]
    );

    const handleReadText = useCallback(
        (text, {source, from}) => {
            sendAudio(text, {source, from});
        },
        []
    );

    const handleRawTextTranslate = useCallback(
        (text) => {
            handleTranslate(text, translationState);
        },
        [handleTranslate, translationState]
    );

    const handleSelectionChange = useCallback(
        (from, to) => {
            if (resultObj.text) {
                handleTranslate(resultObj.text, {...translationState, from, to});
            }
        },
        [resultObj.text, translationState, handleTranslate]
    );

    useEffect(
        () => {
            const asyncGetData = async (tabId) => {
                const result = await getIsContentScriptEnabled(tabId);

                setIsContentScriptEnabled(result);
            };

            getCurrentTab(tab => tab && asyncGetData(tab.id));
        },
        []
    );

    return (
        <div id="sc-translator-root" className={`container ${darkMode ? 'dark' : 'light'}`}>
            <div className="title">
                <div className='title-logo'>{getI18nMessage('extName')}</div>
                <div className='title-icons'>
                    <IconFont
                        iconName={darkMode ? '#icon-IoMdMoon' : '#icon-IoMdSunny'}
                        className='title-icons-enable'
                        onClick={() => handleDarkModeToggle(darkMode)}
                        title={darkMode ? getI18nMessage('popupDisableDarkMode') : getI18nMessage('popupEnableDarkMode')}
                    />
                    <IconFont
                        iconName='#icon-MdTranslate'
                        className={`${isEnableTranslate && isContentScriptEnabled? 'title-icons-enable': 'title-icons-disable'}`}
                        onClick={() => isContentScriptEnabled && handleIsEnableToggle(
                            translateHostList,
                            translateBlackListMode,
                            isEnableTranslate,
                            'translateHostList'
                        )}
                        title={isContentScriptEnabled? isEnableTranslate? getI18nMessage('popupDisableTranslate'): getI18nMessage('popupEnableTranslate'): getI18nMessage('popupNotAvailable')}
                    />
                    <IconFont
                        iconName='#icon-MdHistory'
                        className={`${isEnableHistory && isContentScriptEnabled? 'title-icons-enable': 'title-icons-disable'}`}
                        onClick={() => isContentScriptEnabled && handleIsEnableToggle(
                            historyHostList,
                            historyBlackListMode,
                            isEnableHistory,
                            'historyHostList'
                        )}
                        title={isContentScriptEnabled? isEnableHistory? getI18nMessage('popupDisableHistory'): getI18nMessage('popupEnableHistory'): getI18nMessage('popupNotAvailable')}
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
                    rawTextTranslate={handleRawTextTranslate}
                />
                <LanguageSelection
                    selectionChange={handleSelectionChange}
                />
                <TsResult
                    resultObj={resultObj}
                    status={{requestEnd, requesting, err, errCode}}
                    sourceChange={handleSourceChange}
                    readText={handleReadText}
                    source={translationState.source}
                />
            </div>
        </div>
    )
};

export default Popup;