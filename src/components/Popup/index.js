import React, {useCallback, useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import LanguageSelection from '../LanguageSelection';
import {translationSetSource} from '../../redux/actions/translationActions';
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
import {getPopupText} from '../../public/localization';
import './style.css';

const Popup = () => {
    const [isContentScriptEnabled, setIsContentScriptEnabled] = useState(false);

    const isEnableTranslate = useIsEnable('translate');
    const isEnableHistory = useIsEnable('history');

    const {
        translateBlackListMode,
        translateHostList,
        historyBlackListMode,
        historyHostList
    } = useOptions([
        'translateBlackListMode',
        'translateHostList',
        'historyBlackListMode',
        'historyHostList'
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
                dispatch(translationSetSource(source));
                if (resultObj.text) {
                    handleTranslate(resultObj.text, {...translationState, source});
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
        <div id="container">
            <div className="title">
                <div className='title-logo'>ScTranslator</div>
                <div className='title-icons'>
                    <IconFont
                        iconName='#icon-MdTranslate'
                        className={`${isEnableTranslate && isContentScriptEnabled? 'title-icons-enable': 'title-icons-disable'}`}
                        onClick={() => isContentScriptEnabled && handleIsEnableToggle(
                            translateHostList,
                            translateBlackListMode,
                            isEnableTranslate,
                            'translateHostList'
                        )}
                        title={isContentScriptEnabled? isEnableTranslate? getPopupText('disableTranslate'): getPopupText('enableTranslate'): getPopupText('notAvailable')}
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
                        title={isContentScriptEnabled? isEnableHistory? getPopupText('disableHistory'): getPopupText('enableHistory'): getPopupText('notAvailable')}
                    />
                    <IconFont
                        iconName='#icon-MdSettings'
                        className='title-icons-enable'
                        onClick={openOptionsPage}
                        title={getPopupText('openOptionsPage')}
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