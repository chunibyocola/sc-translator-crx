import React, {useCallback, useEffect} from 'react';
import defaultOptions from '../../constants/defaultOptions';
import { audioSource, translateSource } from '../../constants/translateSource';
import {userLangs, langCode} from '../../constants/langCode';
import {setLocalStorage, getI18nMessage} from '../../public/chrome-call';
import {useOptions} from '../../public/react-use';
import HostList from './HostList';
import './style.css';
import DefaultSelect from './DefaultSelect';
import OptionToggle from './OptionToggle';

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
        darkMode,
        showButtonAfterSelect,
        defaultAudioSource
    } = useOptions(Object.keys(defaultOptions));

    useEffect(() => { document.body.className = `${darkMode ? 'dark' : 'light'}`; }, [darkMode]);

    const updateStorage = useCallback((key, value) => (setLocalStorage({[key]: value})), []);

    return (
        <div className='options'>
            <h2>{getI18nMessage('optionsTitle')}</h2>
            <h3>{getI18nMessage('optionsTheme')}</h3>
            <div className='opt-item'>
                <OptionToggle
                    id='dark-mode-checkbox'
                    message='optionsDarkMode'
                    checked={darkMode}
                    onClick={() => updateStorage('darkMode', !darkMode)}
                />
            </div>
            <h3>{getI18nMessage('optionsAudio')}</h3>
            <div className='opt-item'>
                {getI18nMessage('optionsDefaultAudioOptions')}
                <DefaultSelect
                    message='optionsSource'
                    value={defaultAudioSource}
                    onChange={value => updateStorage('defaultAudioSource', value)}
                    options={audioSource}
                    optionValue='source'
                    optionLabel='url'
                />
            </div>
            <h3>{getI18nMessage('optionsTranslate')}</h3>
            <div className='opt-item'>
                <OptionToggle
                    id='context-menus-checkbox'
                    message='optionsEnableContextMenus'
                    checked={enableContextMenus}
                    onClick={() => updateStorage('enableContextMenus', !enableContextMenus)}
                />
            </div>
            <div className='opt-item'>
                <OptionToggle
                    id='show-button-after-select-checkbox'
                    message='optionsShowButtonAfterSelect'
                    checked={showButtonAfterSelect}
                    onClick={() => updateStorage('showButtonAfterSelect', !showButtonAfterSelect)}
                />
            </div>
            <div className='opt-item'>
                {getI18nMessage('optionsDefaultTranslateOptions')}
                <DefaultSelect
                    message='optionsLanguage'
                    value={userLanguage}
                    onChange={value => updateStorage('userLanguage', value)}
                    options={userLangs}
                    optionValue='code'
                    optionLabel='name'
                />
                <DefaultSelect
                    message='optionsSource'
                    value={defaultTranslateSource}
                    onChange={value => {
                        updateStorage('defaultTranslateSource', value);
                        updateStorage('defaultTranslateFrom', '');
                        updateStorage('defaultTranslateTo', '');
                    }}
                    options={translateSource}
                    optionValue='source'
                    optionLabel='url'
                />
                <DefaultSelect
                    message='optionsFrom'
                    value={defaultTranslateFrom}
                    onChange={value => updateStorage('defaultTranslateFrom', value)}
                    options={langCode[defaultTranslateSource][userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
                <DefaultSelect
                    message='optionsTo'
                    value={defaultTranslateTo}
                    onChange={value => updateStorage('defaultTranslateTo', value)}
                    options={langCode[defaultTranslateSource][userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-item'>
                <OptionToggle
                    id='translate-directly-checkbox'
                    message='optionsTranslateDirectly'
                    checked={translateDirectly}
                    onClick={() => updateStorage('translateDirectly', !translateDirectly)}
                />
            </div>
            <div className='opt-item'>
                <OptionToggle
                    id='translate-black-list-mode-checkbox'
                    message='optionsTranslateBlackListMode'
                    checked={translateBlackListMode}
                    onClick={() => updateStorage('translateBlackListMode', !translateBlackListMode)}
                />
            </div>
            <div className='opt-item'>
                <HostList
                    list={translateHostList}
                    updateList={list => updateStorage('translateHostList', list)}
                />
            </div>
            <h3>{getI18nMessage('optionsHistory')}</h3>
            <div className='opt-item'>
                <OptionToggle
                    id='history-black-list-mode-checkbox'
                    message='optionsHistoryBlackListMode'
                    checked={historyBlackListMode}
                    onClick={() => updateStorage('historyBlackListMode', !historyBlackListMode)}
                />
            </div>
            <div className='opt-item'>
                <HostList
                    list={historyHostList}
                    updateList={list => updateStorage('historyHostList', list)}
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