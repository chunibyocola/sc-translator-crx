import React, { useState, useEffect, useCallback } from 'react';
import IconFont from '../IconFont';
import { getI18nMessage, setLocalStorage, openOptionsPage } from '../../public/chrome-call';
import { useIsEnable, useOptions } from '../../public/react-use';
import { getCurrentTabHost, getCurrentTab, getIsContentScriptEnabled } from '../../public/utils';
import './style.css';

const PopupHeader = () => {
    const [isContentScriptEnabled, setIsContentScriptEnabled] = useState(false);

    const isEnableTranslate = useIsEnable('translate');
    const isEnableHistory = useIsEnable('history');

    const {
        translateBlackListMode,
        translateHostList,
        historyBlackListMode,
        historyHostList,
        styleVarsList,
        styleVarsIndex
    } = useOptions([
        'translateBlackListMode',
        'translateHostList',
        'historyBlackListMode',
        'historyHostList',
        'styleVarsList',
        'styleVarsIndex'
    ]);

    useEffect(() => {
        const asyncGetData = async (tabId) => {
            const result = await getIsContentScriptEnabled(tabId);

            setIsContentScriptEnabled(result);
        };

        getCurrentTab(tab => tab && asyncGetData(tab.id));
    }, []);

    const handleIsEnableToggle = useCallback((list, bMode, isEnable, key) => {
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
    }, []);

    const handleThemeToggle = useCallback(() => {
        setLocalStorage({'styleVarsIndex': styleVarsIndex >= styleVarsList.length - 1 ? 0 : styleVarsIndex + 1});
    }, [styleVarsList, styleVarsIndex]);

    return (
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
    );
};

export default PopupHeader;