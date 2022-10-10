import React from 'react';
import Checkbox from '../../../../components/Checkbox';
import SourceSelect from '../../../../components/SourceSelect';
import Switch from '../../../../components/Switch';
import { preferredLangCode } from '../../../../constants/langCode';
import { GOOGLE_COM, webPageTranslateSource as webPageTranslateSourceList } from '../../../../constants/translateSource';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { DefaultOptions } from '../../../../types';
import BetaIcon from '../../BetaIcon';
import CustomTranslateSourceDisplay from '../../CustomTranslateSourceDisplay';
import DefaultSelect from '../../DefaultSelect';
import HostList from '../../HostList';
import WebPageTranslateDisplayMode from '../../WebPageTranslateDisplayMode';

type PickedOptions = Pick<
    DefaultOptions,
    'webPageTranslateSource' |
    'webPageTranslateTo' |
    'webPageTranslateDisplayMode' |
    'userLanguage' |
    'webPageTranslateDirectly' |
    'noControlBarWhileFirstActivating' |
    'displayModeEnhancement' |
    'customWebpageTranslateSourceList' |
    'translateDynamicContent' |
    'autoTranslateWebpageHostList'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'webPageTranslateSource',
    'webPageTranslateTo',
    'webPageTranslateDisplayMode',
    'userLanguage',
    'webPageTranslateDirectly',
    'noControlBarWhileFirstActivating',
    'displayModeEnhancement',
    'customWebpageTranslateSourceList',
    'translateDynamicContent',
    'autoTranslateWebpageHostList'
];

const WebPageTranslating: React.FC = () => {
    const {
        webPageTranslateSource,
        webPageTranslateTo,
        userLanguage,
        webPageTranslateDisplayMode,
        webPageTranslateDirectly,
        noControlBarWhileFirstActivating,
        displayModeEnhancement,
        customWebpageTranslateSourceList,
        translateDynamicContent,
        autoTranslateWebpageHostList
    } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>
                    {getMessage('optionsWebPageTranslatingDescription')}
                    <a
                        target='_blank'
                        href='https://github.com/chunibyocola/sc-translator-crx/discussions/56'
                        rel='noreferrer'
                    >
                        {getMessage('optionsWebpageTranslatingInstructions')}
                    </a>
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsCustomWebpageTranslateSource')}<BetaIcon />
                <div className='item-description'>
                    {getMessage('optionsCustomWebpageTranslateSourceDescription')}
                    <a
                        target='_blank'
                        href='https://github.com/chunibyocola/sc-translator-crx/discussions/50'
                        rel='noreferrer'
                    >
                        {getMessage('optionsCustomWebpageTranslateSourceLearn')}
                    </a>
                </div>
                <div className='mt10-ml30'>
                    <CustomTranslateSourceDisplay
                        customTranslateSources={customWebpageTranslateSourceList}
                        onChange={(value) => {
                            const availableSources = webPageTranslateSourceList.concat(value).map(v => v.source);
                            setLocalStorage({
                                webPageTranslateSource: availableSources.includes(webPageTranslateSource) ? webPageTranslateSource : GOOGLE_COM,
                                customWebpageTranslateSourceList: value
                            });
                        }}
                        webpage
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsSource')}
                <SourceSelect
                    className='border-bottom-select opt-source-select'
                    sourceList={webPageTranslateSourceList.concat(customWebpageTranslateSourceList)}
                    source={webPageTranslateSource}
                    onChange={value => setLocalStorage({ webPageTranslateSource: value })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsTo')}
                <DefaultSelect
                    value={webPageTranslateTo}
                    onChange={value => setLocalStorage({ webPageTranslateTo: value })}
                    options={preferredLangCode[userLanguage]}
                    optionValue='code'
                    optionLabel='name'
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsDisplayMode')}
                <div className='mt10-ml30'>
                    <WebPageTranslateDisplayMode
                        update={displayMode => setLocalStorage({ webPageTranslateDisplayMode: displayMode })}
                        displayMode={webPageTranslateDisplayMode}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsEnhancementOfDisplay')}
                <BetaIcon />
                <div className='mt10-ml30'>
                    {getMessage('optionsOriginalText')}
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsMouseHoverOverOriginalText')}
                            checked={displayModeEnhancement.o_Hovering}
                            onChange={v => setLocalStorage({ displayModeEnhancement: { ...displayModeEnhancement, o_Hovering: v } })}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {`${getMessage('optionsOriginalText')} + ${getMessage('optionsTranslation')}`}
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsAddUnderlineToTranslations')}
                            checked={displayModeEnhancement.oAndT_Underline}
                            onChange={v => setLocalStorage({ displayModeEnhancement: { ...displayModeEnhancement, oAndT_Underline: v } })}
                        />
                    </div>
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsNotDisplayingTheTranslationsDiscretely')}
                            checked={displayModeEnhancement.oAndT_NonDiscrete}
                            onChange={v => setLocalStorage({ displayModeEnhancement: { ...displayModeEnhancement, oAndT_NonDiscrete: v } })}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('optionsTranslation')}
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsMouseHoverOverTranslation')}
                            checked={displayModeEnhancement.t_Hovering}
                            onChange={v => setLocalStorage({ displayModeEnhancement: { ...displayModeEnhancement, t_Hovering: v } })}
                        />
                    </div>
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsWebPageTranslateDirectly')}
                    checked={webPageTranslateDirectly}
                    onChange={v => setLocalStorage({ webPageTranslateDirectly: v })}
                />
                <div className='item-description'>
                    {getMessage('optionsWebPageTranslateDirectlyDescription')}
                </div>
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsNoControlBarWhileFirstActivating')}
                        checked={noControlBarWhileFirstActivating}
                        onChange={v => setLocalStorage({ noControlBarWhileFirstActivating: v })}
                    />
                    <div className='item-description'>
                        {getMessage('optionsNoControlBarWhileFirstActivatingDescription')}
                    </div>
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateDynamicContent')}
                    checked={translateDynamicContent}
                    onChange={v => setLocalStorage({ translateDynamicContent: v })}
                />
                <BetaIcon />
                <div className='item-description'>
                    {getMessage('optionsTranslateDynamicContentDescription')}
                </div>
                <div className='mt10-ml30'>
                    <HostList
                        list={autoTranslateWebpageHostList}
                        updateList={list => setLocalStorage({ autoTranslateWebpageHostList: list })}
                    />
                </div>
            </div>
        </div>
    );
};

export default WebPageTranslating;