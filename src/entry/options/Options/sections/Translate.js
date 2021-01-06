import React from 'react';
import Slider from '../../../../components/Slider';
import SourceSelect from '../../../../components/SourceSelect';
import { langCode, mtLangCode, preferredLangCode, userLangs } from '../../../../constants/langCode';
import { translateSource } from '../../../../constants/translateSource';
import { getI18nMessage } from '../../../../public/chrome-call';
import { switchTranslateSource } from '../../../../public/switch-translate-source';
import BtnPostion from '../../BtnPosition';
import DefaultSelect from '../../DefaultSelect';
import HostList from '../../HostList';
import OptionToggle from '../../OptionToggle';
import TransferList from '../../TransferList';

const marksHideButtonFixedTime = [
    { value: 500, label: '0.50s' },
    { value: 1000, label: '1.00s' },
    { value: 2000, label: '2.00s' },
    { value: 3000, label: '3.00s' },
    { value: 4000, label: '4.00s' }
];
const hideButtonFixedTimeLabelFormat = v => `${(v / 1000).toFixed(2)}s`

const Translate = ({
    updateStorage,
    translateWithKeyPress,
    enableContextMenus,
    translateDirectly,
    showButtonAfterSelect,
    btnPosition,
    hideButtonAfterFixedTime,
    hideButtonFixedTime,
    multipleTranslateMode,
    userLanguage,
    preferredLanguage,
    multipleTranslateSourceList,
    multipleTranslateFrom,
    multipleTranslateTo,
    defaultTranslateSource,
    defaultTranslateFrom,
    defaultTranslateTo,
    translateBlackListMode,
    translateHostList
}) => {
    return (
        <>
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
        </>
    );
};

export default Translate;