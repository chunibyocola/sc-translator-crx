import React from 'react';
import SourceSelect from '../../../../components/SourceSelect';
import Switch from '../../../../components/Switch';
import { googleLangCode, langCode, mtLangCode, preferredLangCode, userLangs } from '../../../../constants/langCode';
import { GOOGLE_COM, translateSource } from '../../../../constants/translateSource';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { switchTranslateSource } from '../../../../public/switch-translate-source';
import { DefaultOptions } from '../../../../types';
import BetaIcon from '../../components/BetaIcon';
import CustomTranslateSourceDisplay from '../../components/CustomTranslateSourceDisplay';
import DefaultSelect from '../../components/DefaultSelect';
import MultipleSourcesDisplay from '../../components/MultipleSourcesDisplay';
import TranslationDisplay from '../../components/TranslationDisplay';

type PickedOptions = Pick<
    DefaultOptions,
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
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
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
    } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsUseDotCn')}
                    checked={useDotCn}
                    onChange={v => setLocalStorage({ useDotCn: v })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsLanguage')}
                <DefaultSelect
                    value={userLanguage}
                    onChange={value => setLocalStorage({ userLanguage: value })}
                    options={userLangs}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsPreferredLanguage')}
                <DefaultSelect
                    value={preferredLanguage}
                    onChange={value => setLocalStorage({ preferredLanguage: value })}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsSecondPreferredLanguage')}
                <DefaultSelect
                    value={secondPreferredLanguage}
                    onChange={value => setLocalStorage({ secondPreferredLanguage: value })}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
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
                            setLocalStorage({
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
                    onChange={v => setLocalStorage({ multipleTranslateMode: v })}
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
                            onChange={value => setLocalStorage({ multipleTranslateSourceList: value })}
                        />
                    </div>
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsFrom')}
                    <DefaultSelect
                        value={multipleTranslateFrom}
                        onChange={value => setLocalStorage({ multipleTranslateFrom: value })}
                        options={mtLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsTo')}
                    <DefaultSelect
                        value={multipleTranslateTo}
                        onChange={value => setLocalStorage({ multipleTranslateTo: value })}
                        options={mtLangCode[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
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
                            setLocalStorage({
                                defaultTranslateSource: source,
                                defaultTranslateFrom: from,
                                defaultTranslateTo: to
                            });
                        }}
                    />
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsFrom')}
                    <DefaultSelect
                        value={defaultTranslateFrom}
                        onChange={value => setLocalStorage({ defaultTranslateFrom: value })}
                        options={(langCode[defaultTranslateSource] ?? googleLangCode)[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
                <div className='opt-section-row'>
                    {getMessage('optionsTo')}
                    <DefaultSelect
                        value={defaultTranslateTo}
                        onChange={value => setLocalStorage({ defaultTranslateTo: value })}
                        options={(langCode[defaultTranslateSource] ?? googleLangCode)[userLanguage]}
                        optionValue='code'
                        optionLabel='name'
                    />
                </div>
            </>}
            <div className='opt-section-row'>
                {getMessage('optionsDisplayOfTranslation')}
                <div className='item-description'>{getMessage('optionsDisplayOfTranslationDescription')}</div>
                <div className='mt10-ml30'>
                    <TranslationDisplay
                        displayOfTranslation={displayOfTranslation}
                        onChange={v => setLocalStorage({ displayOfTranslation: v })}
                    />
                </div>
            </div>
        </div>
    );
};

export default DefaultTranslateOptions;