import React, { useCallback, useEffect, useState } from 'react';
import defaultOptions from '../../../constants/defaultOptions';
import { audioSource, translateSource } from '../../../constants/translateSource';
import { userLangs, langCode, mtLangCode, preferredLangCode } from '../../../constants/langCode';
import { setLocalStorage, getI18nMessage, getAllCommands, createNewTab } from '../../../public/chrome-call';
import { useOptions } from '../../../public/react-use';
import HostList from '../HostList';
import './style.css';
import DefaultSelect from '../DefaultSelect';
import OptionToggle from '../OptionToggle';
import TransferList from '../TransferList';
import SourceSelect from '../../../components/SourceSelect';
import CustomizeTheme from '../CustomizeTheme';
import { SC_CALL_OUT, SC_TRANSLATE, SC_AUDIO, EXECUTE_BROWSER_ACTION, SC_OPEN_SEPARATE_WINDOW } from '../../../constants/commandsName';
import { switchTranslateSource } from '../../../public/switch-translate-source';
import BtnPostion from '../BtnPosition';
import Slider from '../../../components/Slider';
import { sendAudio } from '../../../public/send';

const marksVolume = [
    { value: 5, label: '5' },
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
    { value: 100, label: '100' }
];
const marksPlaybackRate = [
    { value: 0.5, label: '0.50x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1.00x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 1.75, label: '1.75x' },
    { value: 2, label: '2.00x' }
];
const marksHideButtonFixedTime = [
    { value: 500, label: '0.50s' },
    { value: 1000, label: '1.00s' },
    { value: 2000, label: '2.00s' },
    { value: 3000, label: '3.00s' },
    { value: 4000, label: '4.00s' }
];
const volumeFormat = v => Number(Number(v).toFixed(0));
const playbackRateFormat = v => Number(Number(v).toFixed(2));
const volumeLabelFormat = v => `${Number(v).toFixed(0)}`;
const playbackRateLabelFormat = v => `${Number(v).toFixed(2)}x`;
const hideButtonFixedTimeLabelFormat = v => `${(v / 1000).toFixed(2)}s`

const Options = () => {
    const [commands, setCommands] = useState({});

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
        showButtonAfterSelect,
        defaultAudioSource,
        translateWithKeyPress,
        useDotCn,
        multipleTranslateMode,
        multipleTranslateSourceList,
        multipleTranslateFrom,
        multipleTranslateTo,
        enablePdfViewer,
        preferredLanguage,
        styleVarsList,
        styleVarsIndex,
        btnPosition,
        audioVolume,
        audioPlaybackRate,
        hideButtonAfterFixedTime,
        hideButtonFixedTime
    } = useOptions(Object.keys(defaultOptions));

    const updateStorage = useCallback((key, value) => (setLocalStorage({[key]: value})), []);

    useEffect(() => {
        getAllCommands((commands) => {
            setCommands(commands.reduce((t, v) => ({ ...t, [v.name]: v.shortcut }), {}));
        });
    }, []);

    return (
        <div className='options'>
            <h2>{getI18nMessage('optionsTitle')}</h2>
            <h3>{getI18nMessage('optionsTheme')}</h3>
            <div className='opt-item'>
                <CustomizeTheme
                    styleVarsList={styleVarsList}
                    styleVarsIndex={styleVarsIndex}
                    updateStyleVarsList={list => updateStorage('styleVarsList', list)}
                    updateStyleVarsIndex={index => updateStorage('styleVarsIndex', index)}
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
                    <div className='opt-source-select'>
                        {getI18nMessage('optionsSource')}
                        <SourceSelect
                            sourceList={audioSource}
                            source={defaultAudioSource}
                            onChange={value => updateStorage('defaultAudioSource', value)}
                        />
                    </div>
                </div>
            </div>
            <div className='opt-item'>
                {getI18nMessage('optionsVolume')}
                <Slider
                    defaultValue={audioVolume}
                    min={5}
                    max={100}
                    step={5}
                    marks={marksVolume}
                    valueLabelDisplay
                    mouseUpCallback={v => updateStorage('audioVolume', volumeFormat(v))}
                    valueLabelFormat={volumeLabelFormat}
                />
                {getI18nMessage('optionsPlaybackRate')}
                <Slider
                    defaultValue={audioPlaybackRate}
                    min={0.5}
                    max={2}
                    step={0.25}
                    marks={marksPlaybackRate}
                    valueLabelDisplay
                    mouseUpCallback={v => updateStorage('audioPlaybackRate', playbackRateFormat(v))}
                    valueLabelFormat={playbackRateLabelFormat}
                />
                <button onClick={() => sendAudio('this is a test audio', { from: 'en' })}>{getI18nMessage('optionsPlayTestAudio')}</button>
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
                    id='translate-directly-checkbox'
                    message='optionsTranslateDirectly'
                    checked={translateDirectly}
                    onClick={() => updateStorage('translateDirectly', !translateDirectly)}
                />
                <OptionToggle
                    id='show-button-after-select-checkbox'
                    message='optionsShowButtonAfterSelect'
                    checked={showButtonAfterSelect}
                    onClick={() => updateStorage('showButtonAfterSelect', !showButtonAfterSelect)}
                />
                <div className='child-mt10-ml30'>
                    {getI18nMessage('optionsButtonsPosition')}
                    <BtnPostion currentPos={btnPosition} updateBtnPostion={pos => updateStorage('btnPosition', pos)} />
                </div>
                <OptionToggle
                    id='hide-button-after-fixed-time'
                    message='optionsHideButtonAfterFixedTime'
                    checked={hideButtonAfterFixedTime}
                    onClick={() => updateStorage('hideButtonAfterFixedTime', !hideButtonAfterFixedTime)}
                />
                <div className='child-mt10-ml30'>
                    {getI18nMessage('optionsTheFixedTimeOfHidingButton')}
                    <Slider
                        defaultValue={hideButtonFixedTime}
                        min={500}
                        max={4000}
                        step={250}
                        marks={marksHideButtonFixedTime}
                        valueLabelDisplay
                        valueLabelFormat={hideButtonFixedTimeLabelFormat}
                        mouseUpCallback={v => updateStorage('hideButtonFixedTime', v)}
                    />
                </div>
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
                        <div className='opt-source-select'>
                            {getI18nMessage('optionsSource')}
                            <SourceSelect
                                sourceList={translateSource}
                                source={defaultTranslateSource}
                                onChange={value => {
                                    const { source, from, to } = switchTranslateSource(value, {
                                        source: defaultTranslateSource,
                                        from: defaultTranslateFrom,
                                        to: defaultTranslateTo
                                    });
                                    updateStorage('defaultTranslateSource', source);
                                    updateStorage('defaultTranslateFrom', from);
                                    updateStorage('defaultTranslateTo', to);
                                }}
                            />
                        </div>
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
            <h3>{getI18nMessage('optionsKeyboardShortcut')}</h3>
            <div className='opt-item'>
                {getI18nMessage('extActivateExtensionDescription')}
                <span className='keyboard-shortcut'>{commands[EXECUTE_BROWSER_ACTION] ?? ''}</span>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extTranslateCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_TRANSLATE] ?? ''}</span>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extListenCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_AUDIO] ?? ''}</span>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extCallOutCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_CALL_OUT] ?? ''}</span>
                <div className='item-description'>{getI18nMessage('optionsCallOutCommandDescription')}</div>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extOpenSeparateWindowDescription')}
                <span className='keyboard-shortcut'>{commands[SC_OPEN_SEPARATE_WINDOW] ?? ''}</span>
            </div>
            <div className='opt-item item-description'>
                <p onClick={() => createNewTab('chrome://extensions/shortcuts')} className='link-p'>
                    {getI18nMessage('optionsCustomizeHere')}
                </p>
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