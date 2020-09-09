import React, {useCallback, useEffect} from 'react';
import defaultOptions from '../../constants/defaultOptions';
import { audioSource, translateSource } from '../../constants/translateSource';
import { userLangs, langCode, mtLangCode, preferredLangCode } from '../../constants/langCode';
import {setLocalStorage, getI18nMessage} from '../../public/chrome-call';
import {useOptions} from '../../public/react-use';
import HostList from './HostList';
import './style.css';
import DefaultSelect from './DefaultSelect';
import OptionToggle from './OptionToggle';
import TransferList from './TransferList';

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
        defaultAudioSource,
        translateWithKeyPress,
        useDotCn,
        multipleTranslateMode,
        multipleTranslateSourceList,
        multipleTranslateFrom,
        multipleTranslateTo,
        enablePdfViewer,
        preferredLanguage
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
            <h3>URL</h3>
            <div className='opt-item'>
                <OptionToggle
                    id='use-dot-cn'
                    message='optionsUseDotCn'
                    checked={useDotCn}
                    onClick={() => updateStorage('useDotCn', !useDotCn)}
                />
            </div>
            <h3>PDF</h3>
            <div className='opt-item'>
                <OptionToggle
                    id='enalbe-pdf-viewer'
                    message='optionsEnablePdfViewer'
                    checked={enablePdfViewer}
                    onClick={() => updateStorage('enablePdfViewer', !enablePdfViewer)}
                />
                <div className='item-description'>{getI18nMessage('optionsEnablePdfViewerDescription')}</div>
            </div>
            <h3>{getI18nMessage('optionsAudio')}</h3>
            <div className='opt-item'>
                {getI18nMessage('optionsDefaultAudioOptions')}
                <div className='child-mt10-ml30'>
                    <DefaultSelect
                        message='optionsSource'
                        value={defaultAudioSource}
                        onChange={value => updateStorage('defaultAudioSource', value)}
                        options={audioSource}
                        optionValue='source'
                        optionLabel='url'
                    />
                </div>
            </div>
            <h3>{getI18nMessage('optionsTranslate')}</h3>
            <div className='opt-item child-mt10-ml30'>
                {getI18nMessage('optionsInWebPage')}
                <OptionToggle
                    id='translate-with-key-press-checkbox'
                    message='optionsTranslateWithKeyPress'
                    checked={translateWithKeyPress}
                    onClick={() => updateStorage('translateWithKeyPress', !translateWithKeyPress)}
                />
                <OptionToggle
                    id='context-menus-checkbox'
                    message='optionsEnableContextMenus'
                    checked={enableContextMenus}
                    onClick={() => updateStorage('enableContextMenus', !enableContextMenus)}
                />
                <OptionToggle
                    id='show-button-after-select-checkbox'
                    message='optionsShowButtonAfterSelect'
                    checked={showButtonAfterSelect}
                    onClick={() => updateStorage('showButtonAfterSelect', !showButtonAfterSelect)}
                />
                <OptionToggle
                    id='translate-directly-checkbox'
                    message='optionsTranslateDirectly'
                    checked={translateDirectly}
                    onClick={() => updateStorage('translateDirectly', !translateDirectly)}
                />
            </div>
            <div className='opt-item'>
                {getI18nMessage('optionsDefaultTranslateOptions')}
                <div className='child-mt10-ml30'>
                    <div className='options-mode'>
                        {getI18nMessage('optionsMode')}
                        <OptionToggle
                            id='multiple-translate-mode'
                            message='optionsMultipleTranslateMode'
                            checked={multipleTranslateMode}
                            onClick={() => updateStorage('multipleTranslateMode', !multipleTranslateMode)}
                        />
                    </div>
                    <DefaultSelect
                        message='optionsLanguage'
                        value={userLanguage}
                        onChange={value => updateStorage('userLanguage', value)}
                        options={userLangs}
                        optionValue='code'
                        optionLabel='name'
                    />
                    <DefaultSelect
                        message='optionsPreferredLanguage'
                        value={preferredLanguage}
                        onChange={value => updateStorage('preferredLanguage', value)}
                        options={preferredLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                    <div className='item-description'>{getI18nMessage('optionsPreferredLanguageDescription')}</div>
                    {multipleTranslateMode ?
                        <>
                            <TransferList
                                enabledList={multipleTranslateSourceList}
                                onChange={value => updateStorage('multipleTranslateSourceList', value)}
                            />
                            <DefaultSelect
                                message='optionsFrom'
                                value={multipleTranslateFrom}
                                onChange={value => updateStorage('multipleTranslateFrom', value)}
                                options={mtLangCode[userLanguage]}
                                optionValue='code'
                                optionLabel='name'
                            />
                            <DefaultSelect
                                message='optionsTo'
                                value={multipleTranslateTo}
                                onChange={value => updateStorage('multipleTranslateTo', value)}
                                options={mtLangCode[userLanguage]}
                                optionValue='code'
                                optionLabel='name'
                            />
                        </> :
                    <>
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
                    </>}
                </div>
            </div>
            <div className='opt-item'>
                {getI18nMessage('optionsDomainfilter')}
                <div className='child-mt10-ml30'>
                    <OptionToggle
                        id='translate-black-list-mode-checkbox'
                        message='optionsTranslateBlackListMode'
                        checked={translateBlackListMode}
                        onClick={() => updateStorage('translateBlackListMode', !translateBlackListMode)}
                    />
                    <HostList
                        list={translateHostList}
                        updateList={list => updateStorage('translateHostList', list)}
                    />
                </div>
            </div>
            <h3>{getI18nMessage('optionsHistory')}</h3>
            <div className='opt-item'>
                {getI18nMessage('optionsDomainfilter')}
                <div className='child-mt10-ml30'>
                    <OptionToggle
                        id='history-black-list-mode-checkbox'
                        message='optionsHistoryBlackListMode'
                        checked={historyBlackListMode}
                        onClick={() => updateStorage('historyBlackListMode', !historyBlackListMode)}
                    />
                    <HostList
                        list={historyHostList}
                        updateList={list => updateStorage('historyHostList', list)}
                    />
                </div>
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