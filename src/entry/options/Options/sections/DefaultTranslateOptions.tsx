import React from 'react';
import Switch from '../../../../components/Switch';
import { mtLangCode, preferredLangCode, userLangs } from '../../../../constants/langCode';
import { translateSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import BetaIcon from '../../components/BetaIcon';
import CustomTranslateSourceDisplay from '../../components/CustomTranslateSourceDisplay';
import MultipleSourcesDisplay from '../../components/MultipleSourcesDisplay';
import TranslationDisplay from '../../components/TranslationDisplay';
import scOptions from '../../../../public/sc-options';
import LanguageSelect from '../../../../components/LanguageSelect';
import ThirdPartyServices from '../../components/ThirdPartServices';

const useOptionsDependency: GetStorageKeys<
    'userLanguage' |
    'preferredLanguage' |
    'secondPreferredLanguage' |
    'multipleTranslateSourceList' |
    'multipleTranslateFrom' |
    'multipleTranslateTo' |
    'useDotCn' |
    'customTranslateSourceList' |
    'displayOfTranslation' |
    'enabledThirdPartyServices'
> = [
    'userLanguage',
    'preferredLanguage',
    'secondPreferredLanguage',
    'multipleTranslateSourceList',
    'multipleTranslateFrom',
    'multipleTranslateTo',
    'useDotCn',
    'customTranslateSourceList',
    'displayOfTranslation',
    'enabledThirdPartyServices'
];

const DefaultTranslateOptions: React.FC = () => {
    const {
        userLanguage,
        preferredLanguage,
        secondPreferredLanguage,
        multipleTranslateSourceList,
        multipleTranslateFrom,
        multipleTranslateTo,
        useDotCn,
        customTranslateSourceList,
        displayOfTranslation,
        enabledThirdPartyServices
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
                            const availableSources = translateSource.concat(value).map(v => v.source).concat(enabledThirdPartyServices.map(v => v.name));
                            scOptions.set({
                                multipleTranslateSourceList: multipleTranslateSourceList.filter(v => availableSources.includes(v)),
                                customTranslateSourceList: value
                            });
                        }}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('thirdPartyServices')}<BetaIcon />
                <div className='item-description'>{getMessage('thirdPartyServicesDescription')}</div>
                <div className='mt10-ml30'>
                    <ThirdPartyServices
                        enabledThirdPartyServices={enabledThirdPartyServices}
                        onUpdateServices={services => scOptions.set({ enabledThirdPartyServices: services })}
                        onDeleteService={(serviceName) => {
                            scOptions.set({
                                enabledThirdPartyServices: enabledThirdPartyServices.filter(v => v.name !== serviceName),
                                multipleTranslateSourceList: multipleTranslateSourceList.filter(v => v !== serviceName)
                            });
                        }}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsSourceList')}
                <div className='item-description'>{getMessage('optionsMultipleTranslateSourceListDescription')}</div>
                <div className='mt10-ml30'>
                    <MultipleSourcesDisplay
                        enabledSources={multipleTranslateSourceList}
                        sources={translateSource.map(v => v.source).concat(customTranslateSourceList.map(v => v.source)).concat(enabledThirdPartyServices.map(v => v.name))}
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