import React from 'react';
import { GenericOptionsProps } from '..';
import SourceSelect from '../../../../components/SourceSelect';
import { preferredLangCode } from '../../../../constants/langCode';
import { webPageTranslateSource as webPageTranslateSourceList } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import DefaultSelect from '../../DefaultSelect';
import OptionToggle from '../../OptionToggle';
import WebPageTranslateDisplayMode from '../../WebPageTranslateDisplayMode';

type WebPageTranslatingProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'webPageTranslateSource' |
    'webPageTranslateTo' |
    'webPageTranslateDisplayMode' |
    'userLanguage' |
    'webPageTranslateDirectly' |
    'noControlBarWhileFirstActivating'
>>;

const WebPageTranslating: React.FC<WebPageTranslatingProps> = ({
    updateStorage,
    webPageTranslateSource,
    webPageTranslateTo,
    userLanguage,
    webPageTranslateDisplayMode,
    webPageTranslateDirectly,
    noControlBarWhileFirstActivating
}) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>
                    {getMessage('optionsWebPageTranslatingDescription')}
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsSource')}
                <SourceSelect
                    className='border-bottom-select opt-source-select'
                    sourceList={webPageTranslateSourceList}
                    source={webPageTranslateSource}
                    onChange={value => updateStorage('webPageTranslateSource', value)}
                />
            </div>
            <div className='opt-section-row'>
                <DefaultSelect
                    message='optionsTo'
                    value={webPageTranslateTo}
                    onChange={value => updateStorage('webPageTranslateTo', value)}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsDisplayMode')}
                <div className='mt10-ml30'>
                    <WebPageTranslateDisplayMode
                        update={displayMode => updateStorage('webPageTranslateDisplayMode', displayMode)}
                        displayMode={webPageTranslateDisplayMode}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='web-page-translate-directly'
                    message='optionsWebPageTranslateDirectly'
                    checked={webPageTranslateDirectly}
                    onClick={() => updateStorage('webPageTranslateDirectly', !webPageTranslateDirectly)}
                />
                <div className='item-description'>
                    {getMessage('optionsWebPageTranslateDirectlyDescription')}
                </div>
                <div className='mt10-ml30'>
                    <OptionToggle
                        id='no-control-bar-while-first-activating'
                        message='optionsNoControlBarWhileFirstActivating'
                        checked={noControlBarWhileFirstActivating}
                        onClick={() => updateStorage('noControlBarWhileFirstActivating', !noControlBarWhileFirstActivating)}
                    />
                    <div className='item-description'>
                        {getMessage('optionsNoControlBarWhileFirstActivatingDescription')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WebPageTranslating;