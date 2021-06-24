import React from 'react';
import SourceSelect from '../../../../components/SourceSelect';
import { langCode, mtLangCode, preferredLangCode, userLangs } from '../../../../constants/langCode';
import { translateSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { switchTranslateSource } from '../../../../public/switch-translate-source';
import BetaIcon from '../../BetaIcon';
import DefaultSelect from '../../DefaultSelect';
import OptionToggle from '../../OptionToggle';
import RegExpList from '../../RegExpList';
import TestTextProcessing from '../../TestTextPreprocessing';
import TransferList from '../../TransferList';

const DefaultTranslateOptions = ({
    updateStorage,
    multipleTranslateMode,
    userLanguage,
    preferredLanguage,
    secondPreferredLanguage,
    multipleTranslateSourceList,
    multipleTranslateFrom,
    multipleTranslateTo,
    defaultTranslateSource,
    defaultTranslateFrom,
    defaultTranslateTo,
    useDotCn,
    textPreprocessingRegExpList
}) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='use-dot-cn'
                    message='optionsUseDotCn'
                    checked={useDotCn}
                    onClick={() => updateStorage('useDotCn', !useDotCn)}
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsLanguage'
                    value={userLanguage}
                    onChange={value => updateStorage('userLanguage', value)}
                    options={userLangs}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsPreferredLanguage'
                    value={preferredLanguage}
                    onChange={value => updateStorage('preferredLanguage', value)}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsSecondPreferredLanguage'
                    value={secondPreferredLanguage}
                    onChange={value => updateStorage('secondPreferredLanguage', value)}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
                <div className='item-description'>{getMessage('optionsPreferredLanguageDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='multiple-translate-mode'
                    message='optionsMultipleTranslateMode'
                    checked={multipleTranslateMode}
                    onClick={() => updateStorage('multipleTranslateMode', !multipleTranslateMode)}
                />
            </div>
            {multipleTranslateMode ? <>
                <div className='opt-section-row'>
                    <TransferList
                        enabledList={multipleTranslateSourceList}
                        onChange={value => updateStorage('multipleTranslateSourceList', value)}
                    />
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsFrom'
                        value={multipleTranslateFrom}
                        onChange={value => updateStorage('multipleTranslateFrom', value)}
                        options={mtLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsTo'
                        value={multipleTranslateTo}
                        onChange={value => updateStorage('multipleTranslateTo', value)}
                        options={mtLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
            </> : <>
                <div className='opt-section-row'>
                    <div className='opt-source-select'>
                        {getMessage('optionsSource')}
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
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsFrom'
                        value={defaultTranslateFrom}
                        onChange={value => updateStorage('defaultTranslateFrom', value)}
                        options={langCode[defaultTranslateSource][userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
                <div className='opt-section-row'>
                    <DefaultSelect
                        message='optionsTo'
                        value={defaultTranslateTo}
                        onChange={value => updateStorage('defaultTranslateTo', value)}
                        options={langCode[defaultTranslateSource][userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
            </>}
            <div className='opt-section-row'>
                <div className='flex-align-items-center'>
                    {getMessage('optionsTextPreprocessing')} <BetaIcon />
                </div>
                <div className='item-description'>{getMessage('optionsTextPreprocessingDescription')}</div>
                <div className='mt10-ml30'>
                    {getMessage('optionsReplaceWithRegExp')}
                    <div className='item-description'>{getMessage('optionsReplaceWithRegExpDescription')}</div>
                    <div className='mt10-ml30'>
                        <RegExpList
                            textPreprocessingRegExpList={textPreprocessingRegExpList}
                            onSave={value => updateStorage('textPreprocessingRegExpList', value)}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('optionsTestSomeText')}
                    <div className='item-description'>{getMessage('optionsTestSomeTextDescription')}</div>
                    <div className='mt10-ml30'>
                        <TestTextProcessing />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DefaultTranslateOptions;