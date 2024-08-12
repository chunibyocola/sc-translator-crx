import React from 'react';
import SourceSelect from '../../../../components/SourceSelect';
import Switch from '../../../../components/Switch';
import { googleLangCode, langCode, mtLangCode, preferredLangCode, userLangs } from '../../../../constants/langCode';
import { GOOGLE_COM, translateSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { switchTranslateSource } from '../../../../public/switch-translate-source';
import { GetStorageKeys } from '../../../../types';
import BetaIcon from '../../components/BetaIcon';
import CustomTranslateSourceDisplay from '../../components/CustomTranslateSourceDisplay';
import MultipleSourcesDisplay from '../../components/MultipleSourcesDisplay';
import TranslationDisplay from '../../components/TranslationDisplay';
import scOptions from '../../../../public/sc-options';
import LanguageSelect from '../../../../components/LanguageSelect';

const useOptionsDependency: GetStorageKeys<
    'multipleTranslateMode' |
    'userLanguage' |
    'preferredLanguage' |
    'secondPreferredLanguage' |
    'multipleTranslateSourceList' |
    'multipleTranslateFrom' |
    'multipleTranslateTo' |
    'defaultTranslateSource' |
    'defaultTranslateFrom' |
    'defaultTranslateTo' |
    'useDotCn' |
    'customTranslateSourceList' |
    'displayOfTranslation'
> = [
    'multipleTranslateMode',
    'userLanguage',
    'preferredLanguage',
    'secondPreferredLanguage',
    'multipleTranslateSourceList',
    'multipleTranslateFrom',
    'multipleTranslateTo',
    'defaultTranslateSource',
    'defaultTranslateFrom',
    'defaultTranslateTo',
    'useDotCn',
    'customTranslateSourceList',
    'displayOfTranslation'
];

const DefaultTranslateOptions: React.FC = () => {
    const {
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
        customTranslateSourceList,
        displayOfTranslation
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsUseDotCn')}
                    checked={useDotCn}
                    onChange={v => scOptions.set({ useDotCn: v })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsLanguage')}
                <LanguageSelect
                    value={userLanguage}
                    onChange={value => scOptions.set({ userLanguage: value })}
                    langCodes={userLangs}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsPreferredLanguage')}
                <LanguageSelect
                    value={preferredLanguage}
                    onChange={value => scOptions.set({ preferredLanguage: value })}
                    langCodes={preferredLangCode[userLanguage]}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsSecondPreferredLanguage')}
                <LanguageSelect
                    value={secondPreferredLanguage}
                    onChange={value => scOptions.set({ secondPreferredLanguage: value })}
                    langCodes={preferredLangCode[userLanguage]}
                />
                <div className='item-description'>{getMessage('optionsPreferredLanguageDescription')}</div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsCustomTranslateSource')}<BetaIcon />
                <div className='item-description'>
                    {getMessage('optionsCustomTranslateSourceDescription')}
                    <a
                        target='_blank'
                        href='https://github.com/chunibyocola/sc-translator-crx/discussions/31'
                        rel='noreferrer'
                    >
                        {getMessage('optionsCustomTranslateSourceLearn')}
                    </a>
                </div>
                <div className='mt10-ml30'>
                    <CustomTranslateSourceDisplay
                        customTranslateSources={customTranslateSourceList}
                        onChange={(value) => {
                            // If user delete the using custom sources, remove them from options(multipleTranslateSourceList/defaultTranslateSource).
                            const availableSources = translateSource.concat(value).map(v => v.source);
                            scOptions.set({
                                multipleTranslateSourceList: multipleTranslateSourceList.filter(v => availableSources.includes(v)),
                                defaultTranslateSource: availableSources.includes(defaultTranslateSource) ? defaultTranslateSource : GOOGLE_COM,
                                customTranslateSourceList: value
                            });
                        }}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsMultipleTranslateMode')}
                    checked={multipleTranslateMode}
                    onChange={v => scOptions.set({ multipleTranslateMode: v })}
                />
            </div>
            {multipleTranslateMode ? <>
                <div className='opt-section-row'>
                    {getMessage('optionsSourceList')}
                    <div className='item-description'>{getMessage('optionsMultipleTranslateSourceListDescription')}</div>
                    <div className='mt10-ml30'>
                        <MultipleSourcesDisplay
                            enabledSources={multipleTranslateSourceList}
                            sources={translateSource.concat(customTranslateSourceList)}
                            onChange={value => scOptions.set({ multipleTranslateSourceList: value })}
                        />
                    </div>
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsFrom')}
                    <LanguageSelect
                        value={multipleTranslateFrom}
                        onChange={value => scOptions.set({ multipleTranslateFrom: value })}
                        langCodes={mtLangCode[userLanguage]}
                    />
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsTo')}
                    <LanguageSelect
                        value={multipleTranslateTo}
                        onChange={value => scOptions.set({ multipleTranslateTo: value })}
                        langCodes={mtLangCode[userLanguage]}
                    />
                </div>
            </> : <>
                <div className='opt-section-row'>
                    {getMessage('optionsSource')}
                    <SourceSelect
                        className='border-bottom-select opt-source-select'
                        sourceList={translateSource.concat(customTranslateSourceList)}
                        source={defaultTranslateSource}
                        onChange={value => {
                            const { source, from, to } = switchTranslateSource(value, {
                                source: defaultTranslateSource,
                                from: defaultTranslateFrom,
                                to: defaultTranslateTo
                            });
                            scOptions.set({
                                defaultTranslateSource: source,
                                defaultTranslateFrom: from,
                                defaultTranslateTo: to
                            });
                        }}
                    />
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsFrom')}
                    <LanguageSelect
                        value={defaultTranslateFrom}
                        onChange={value => scOptions.set({ defaultTranslateFrom: value })}
                        langCodes={(langCode[defaultTranslateSource] ?? googleLangCode)[userLanguage]}
                    />
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsTo')}
                    <LanguageSelect
                        value={defaultTranslateTo}
                        onChange={value => scOptions.set({ defaultTranslateTo: value })}
                        langCodes={(langCode[defaultTranslateSource] ?? googleLangCode)[userLanguage]}
                    />
                </div>
            </>}
            <div className='opt-section-row'>
                {getMessage('optionsDisplayOfTranslation')}
                <div className='item-description'>{getMessage('optionsDisplayOfTranslationDescription')}</div>
                <div className='mt10-ml30'>
                    <TranslationDisplay
                        displayOfTranslation={displayOfTranslation}
                        onChange={v => scOptions.set({ displayOfTranslation: v })}
                    />
                </div>
            </div>
        </div>
    );
};

export default DefaultTranslateOptions;