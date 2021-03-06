import React, { useState, useEffect, useCallback } from 'react';
import IconFont from '../IconFont';
import { setLocalStorage, openOptionsPage } from '../../public/chrome-call';
import { useIsEnable, useOptions } from '../../public/react-use';
import { getCurrentTabHost } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';

const useOptionsDependency = ['translateBlackListMode', 'translateHostList', 'historyBlackListMode', 'historyHostList', 'styleVarsList', 'styleVarsIndex'];

const PopupHeader = () => {
    const [isContentScriptEnabled, setIsContentScriptEnabled] = useState(false);
    const [host, setHost] = useState(null);

    const isEnableTranslate = useIsEnable('translate', host);
    const isEnableHistory = useIsEnable('history', host);

    const { translateBlackListMode, translateHostList, historyBlackListMode, historyHostList, styleVarsList, styleVarsIndex } = useOptions(useOptionsDependency);

    useEffect(() => {
        getCurrentTabHost().then((tabHost) => {
            setIsContentScriptEnabled(!!tabHost);
            setHost(tabHost);
        });
    }, []);

    const handleIsEnableToggle = useCallback((list, bMode, isEnable, key) => {
        if (!host) { return; }

        if ((isEnable && !bMode) || (!isEnable && bMode)) {
            const indexArr = list.reduce((t, v, i) => (
                host.endsWith(v) ? t.concat(i) : t
            ), []).reverse();
            indexArr.map((v) => (list.splice(v, 1)));
            setLocalStorage({ [key]: list });
        }
        else {
            list.push(host);
            setLocalStorage({ [key]: list });
        }
    }, [host]);

    const handleThemeToggle = useCallback(() => {
        setLocalStorage({ 'styleVarsIndex': styleVarsIndex >= styleVarsList.length - 1 ? 0 : styleVarsIndex + 1 });
    }, [styleVarsList, styleVarsIndex]);

    return (
        <div className="title flex-justify-content-space-between">
            <div className='title-logo flex-align-items-center'>Sc</div>
            <div className='title-icons flex-align-items-center'>
                <IconFont
                    iconName='#icon-theme'
                    className='title-icons-enable'
                    onClick={() => handleThemeToggle()}
                    title={getMessage('popupSwitchToTheNextTheme')}
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
                    title={isContentScriptEnabled ? isEnableTranslate ? getMessage('popupDisableTranslate') : getMessage('popupEnableTranslate') : getMessage('popupNotAvailable')}
                />
                <IconFont
                    iconName='#icon-MdHistory'
                    className={`${isEnableHistory && isContentScriptEnabled ? 'title-icons-enable' : 'title-icons-disable'}`}
                    onClick={() => isContentScriptEnabled && handleIsEnableToggle(
                        historyHostList,
                        historyBlackListMode,
                        isEnableHistory,
                        'historyHostList'
                    )}
                    title={isContentScriptEnabled ? isEnableHistory ? getMessage('popupDisableHistory') : getMessage('popupEnableHistory') : getMessage('popupNotAvailable')}
                />
                <IconFont
                    iconName='#icon-MdSettings'
                    className='title-icons-enable'
                    onClick={openOptionsPage}
                    title={getMessage('popupOpenOptionsPage')}
                />
            </div>
        </div>
    );
};

export default PopupHeader;