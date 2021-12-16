import React from 'react';
import { GenericOptionsProps } from '..';
import SourceSelect from '../../../../components/SourceSelect';
import Switch from '../../../../components/Switch';
import { preferredLangCode } from '../../../../constants/langCode';
import { webPageTranslateSource as webPageTranslateSourceList } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import DefaultSelect from '../../DefaultSelect';
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
                {getMessage('optionsTo')}
                <DefaultSelect
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
                <Switch
                    label={getMessage('optionsWebPageTranslateDirectly')}
                    checked={webPageTranslateDirectly}
                    onChange={v => updateStorage('webPageTranslateDirectly', v)}
                />
                <div className='item-description'>
                    {getMessage('optionsWebPageTranslateDirectlyDescription')}
                </div>
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsNoControlBarWhileFirstActivating')}
                        checked={noControlBarWhileFirstActivating}
                        onChange={v => updateStorage('noControlBarWhileFirstActivating', v)}
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