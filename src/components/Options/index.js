import React, {useCallback, useEffect} from 'react';
import defaultOptions from '../../constants/defaultOptions';
import translateSource from '../../constants/translateSource';
import langCode, {userLangs} from '../../constants/langCode';
import {setLocalStorage, getI18nMessage} from '../../public/chrome-call';
import {useOptions} from '../../public/react-use';
import HostList from './HostList';
import './style.css';

const Options = () => {
    const {
        userLanguage,
        enableContextMenus,
        defaultTranslateSource,
        defaultTranslateFrom,
        defaultTranslateTo,
        translateDirectly,
        translateBlackListMode,
        translateHostList,
        historyBlackListMode,
        historyHostList,
        darkMode
    } = useOptions(Object.keys(defaultOptions));

    useEffect(
        () => {
            document.body.className = `${darkMode ? 'dark' : 'light'}`;
        },
        [darkMode]
    );

    const handleToggleClick = useCallback(
        (key, value) => {
            setLocalStorage({[key]: value})
        },
        []
    );

    const handleSelectChange = useCallback(
        (key, e) => {
            const ele =  e.target;
            const curValue = ele.options[ele.selectedIndex].value;
            setLocalStorage({[key]: curValue});
        },
        []
    );

    const handleHistoryHostListUpdate  = useCallback(
        (list) => {
            setLocalStorage({'historyHostList': list});
        },
        []
    );

    const handleTranslateHostListUpdate  = useCallback(
        (list) => {
            setLocalStorage({'translateHostList': list});
        },
        []
    );

    return (
        <div className='options'>
            <h2>{getI18nMessage('optionsTitle')}</h2>
            <h3>{getI18nMessage('optionsTheme')}</h3>
            <div className='opt-item'>
                <input
                    id='dark-mode-checkbox'
                    type='checkbox'
                    checked={darkMode}
                    onClick={() => handleToggleClick('darkMode', !darkMode)}
                />
                <label for='dark-mode-checkbox'>
                    {getI18nMessage('optionsDarkMode')}
                </label>
            </div>
            <h3>{getI18nMessage('optionsTranslate')}</h3>
            <div className='opt-item'>
                <input
                    id='context-menus-checkbox'
                    type='checkbox'
                    checked={enableContextMenus}
                    onClick={() => handleToggleClick('enableContextMenus', !enableContextMenus)}
                />
                <label for='context-menus-checkbox'>
                    {getI18nMessage('optionsEnableContextMenus')}
                </label>
            </div>
            <div className='opt-item'>
                {getI18nMessage('optionsDefaultTranslateOptions')}
                <div className='default-select'>
                    {getI18nMessage('optionsLanguage')}
                    <select
                        value={userLanguage}
                        onChange={(e) => handleSelectChange('userLanguage', e)}
                    >
                        {userLangs.map(v => (
                            <option key={v.code} value={v.code}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div className='default-select'>
                    {getI18nMessage('optionsSource')}
                    <select
                        value={defaultTranslateSource}
                        onChange={e => handleSelectChange('defaultTranslateSource', e)}
                    >
                        {translateSource.map(v => (
                            <option value={v.source} key={v.source}>{v.url}</option>
                        ))}
                    </select>
                </div>
                <div className='default-select'>
                    {getI18nMessage('optionsFrom')}
                    <select
                        value={defaultTranslateFrom}
                        onChange={e => handleSelectChange('defaultTranslateFrom', e)}
                    >
                        {langCode[userLanguage].map(v => (
                            <option value={v.code} key={v.code}>{v.name}</option>
                        ))}
                    </select>
                </div>
                <div className='default-select'>
                    {getI18nMessage('optionsTo')}
                    <select
                        value={defaultTranslateTo}
                        onChange={e => handleSelectChange('defaultTranslateTo', e)}
                    >
                        {langCode[userLanguage].map(v => (
                            <option value={v.code} key={v.code}>{v.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='opt-item'>
                <input
                    id='translate-directly-checkbox'
                    type='checkbox'
                    checked={translateDirectly}
                    onClick={() => handleToggleClick('translateDirectly', !translateDirectly)}
                />
                <label for='translate-directly-checkbox'>
                    {getI18nMessage('optionsTranslateDirectly')}
                </label>
            </div>
            <div className='opt-item'>
                <input
                    id='translate-black-list-mode-checkbox'
                    type='checkbox'
                    checked={translateBlackListMode}
                    onClick={() => handleToggleClick('translateBlackListMode', !translateBlackListMode)}
                />
                <label for='translate-black-list-mode-checkbox'>
                    {getI18nMessage('optionsTranslateBlackListMode')}
                </label>
            </div>
            <div className='opt-item'>
                <HostList
                    list={translateHostList}
                    updateList={handleTranslateHostListUpdate}
                />
            </div>
            <h3>{getI18nMessage('optionsHistory')}</h3>
            <div className='opt-item'>
                <input
                    id='history-black-list-mode-checkbox'
                    type='checkbox'
                    checked={historyBlackListMode}
                    onClick={() => handleToggleClick('historyBlackListMode', !historyBlackListMode)}
                />
                <label for='history-black-list-mode-checkbox'>
                    {getI18nMessage('optionsHistoryBlackListMode')}
                </label>
            </div>
            <div className='opt-item'>
                <HostList
                    list={historyHostList}
                    updateList={handleHistoryHostListUpdate}
                />
            </div>
            <h3>{getI18nMessage('optionsMoreFeaturesOrBugReports')}</h3>
            <div className='opt-item'>
                <a
                    target='_blank'
                    href='https://github.com/chunibyocola/sc-translator-crx/issues'
                    rel="noopener noreferrer"
                >
                    sc-translator-crx
                </a>
            </div>
        </div>
    );
};

export default Options;