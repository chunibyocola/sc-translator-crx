import React, { useState } from 'react';
import Checkbox from '../../../../components/Checkbox';
import SourceSelect from '../../../../components/SourceSelect';
import Switch from '../../../../components/Switch';
import { preferredLangCode } from '../../../../constants/langCode';
import { GOOGLE_COM, webPageTranslateSource as webPageTranslateSourceList } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import BetaIcon from '../../components/BetaIcon';
import CustomTranslateSourceDisplay from '../../components/CustomTranslateSourceDisplay';
import HostList from '../../components/HostList';
import WebPageTranslateDisplayMode from '../../components/WebPageTranslateDisplayMode';
import CustomizeTranslation from '../../components/CustomizeTranslation';
import Button from '../../../../components/Button';
import scIndexedDB from '../../../../public/sc-indexed-db';
import ConfirmDelete from '../../../collection/components/ConfirmDelete';
import SpecifyRule from '../../components/SpecifyRule';
import scOptions from '../../../../public/sc-options';
import LanguageSelect from '../../../../components/LanguageSelect';

const useOptionsDependency: GetStorageKeys<
    'webPageTranslateSource' |
    'webPageTranslateTo' |
    'webPageTranslateDisplayMode' |
    'userLanguage' |
    'webPageTranslateDirectly' |
    'noControlBarWhileFirstActivating' |
    'displayModeEnhancement' |
    'customWebpageTranslateSourceList' |
    'translateDynamicContent' |
    'autoTranslateWebpageHostList' |
    'enableAutoTranslateWebpage' |
    'comparisonCustomization' |
    'translateIframeContent' |
    'translateRedirectedSameDomainPage' |
    'enablePageTranslationCache'
> = [
    'webPageTranslateSource',
    'webPageTranslateTo',
    'webPageTranslateDisplayMode',
    'userLanguage',
    'webPageTranslateDirectly',
    'noControlBarWhileFirstActivating',
    'displayModeEnhancement',
    'customWebpageTranslateSourceList',
    'translateDynamicContent',
    'autoTranslateWebpageHostList',
    'enableAutoTranslateWebpage',
    'comparisonCustomization',
    'translateIframeContent',
    'translateRedirectedSameDomainPage',
    'enablePageTranslationCache'
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
        autoTranslateWebpageHostList,
        enableAutoTranslateWebpage,
        comparisonCustomization,
        translateIframeContent,
        translateRedirectedSameDomainPage,
        enablePageTranslationCache
    } = useOptions(useOptionsDependency);

    const [readyToClearCache, setReadyToClearCache] = useState(false);

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
                            scOptions.set({
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
                    onChange={value => scOptions.set({ webPageTranslateSource: value })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsTo')}
                <LanguageSelect
                    value={webPageTranslateTo}
                    onChange={value => scOptions.set({ webPageTranslateTo: value })}
                    langCodes={preferredLangCode[userLanguage]}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsDisplayMode')}
                <div className='mt10-ml30'>
                    <WebPageTranslateDisplayMode
                        update={displayMode => scOptions.set({ webPageTranslateDisplayMode: displayMode })}
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
                            onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, o_Hovering: v } })}
                        />
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {`${getMessage('optionsOriginalText')} + ${getMessage('optionsTranslation')}`}
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsNotDisplayingTheTranslationsDiscretely')}
                            checked={displayModeEnhancement.oAndT_NonDiscrete}
                            onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, oAndT_NonDiscrete: v } })}
                        />
                    </div>
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsParagraphWrap')}
                            checked={displayModeEnhancement.oAndT_paragraphWrap}
                            onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, oAndT_paragraphWrap: v } })}
                        />
                    </div>
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsSameLanguageHide')}
                            checked={displayModeEnhancement.oAndT_hideSameLanguage}
                            onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, oAndT_hideSameLanguage: v } })}
                        />
                    </div>
                    <div className='mt10-ml30'>
                        {getMessage('optionsTranslationStyleCustomization')}
                        <div className='mt10-ml30'>
                            <CustomizeTranslation
                                comparisonCustomization={comparisonCustomization}
                                addUnderline={displayModeEnhancement.oAndT_Underline}
                                onChange={v => scOptions.set({ comparisonCustomization: v })}
                            >
                                <Checkbox
                                    label={getMessage('optionsAddUnderlineToTranslations')}
                                    checked={displayModeEnhancement.oAndT_Underline}
                                    onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, oAndT_Underline: v } })}
                                />
                            </CustomizeTranslation>
                        </div>
                    </div>
                </div>
                <div className='mt10-ml30'>
                    {getMessage('optionsTranslation')}
                    <div className='mt10-ml30'>
                        <Checkbox
                            label={getMessage('optionsMouseHoverOverTranslation')}
                            checked={displayModeEnhancement.t_Hovering}
                            onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, t_Hovering: v } })}
                        />
                        <div className='mt10-ml30'>
                            <Checkbox
                                label={getMessage('optionsDisplayOriginalTextWhenCtrlPressed')}
                                checked={displayModeEnhancement.t_hoveringWithKeyPressing}
                                onChange={v => scOptions.set({ displayModeEnhancement: { ...displayModeEnhancement, t_hoveringWithKeyPressing: v } })}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateIframeContent')}
                    checked={translateIframeContent}
                    onChange={v => scOptions.set({ translateIframeContent: v })}
                />
                <BetaIcon />
            </div>
            <div className='opt-section-row flex-align-items-center'>
                <Switch
                    label={getMessage('optionsTranslateRedirectedSameDomainPage')}
                    checked={translateRedirectedSameDomainPage}
                    onChange={(v) => {
                        if (v) {
                            chrome.permissions.request({ permissions: ['webNavigation'] }, (granted) => {
                                granted && scOptions.set({ translateRedirectedSameDomainPage: v });
                            });
                        }
                        else {
                            scOptions.set({ translateRedirectedSameDomainPage: v });
                            chrome.permissions.remove({ permissions: ['webNavigation'] });
                        }
                    }}
                />
                <BetaIcon />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsWebPageTranslateDirectly')}
                    checked={webPageTranslateDirectly}
                    onChange={v => scOptions.set({ webPageTranslateDirectly: v })}
                />
                <div className='item-description'>
                    {getMessage('optionsWebPageTranslateDirectlyDescription')}
                </div>
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsNoControlBarWhileFirstActivating')}
                        checked={noControlBarWhileFirstActivating}
                        onChange={v => scOptions.set({ noControlBarWhileFirstActivating: v })}
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
                    onChange={v => scOptions.set({ translateDynamicContent: v })}
                />
                <BetaIcon />
                <div className='item-description'>
                    {getMessage('optionsTranslateDynamicContentDescription')}
                </div>
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsEnableAutoTranslateWebpage')}
                        checked={enableAutoTranslateWebpage}
                        onChange={v => scOptions.set({ enableAutoTranslateWebpage: v })}
                    />
                    <div className='item-description'>
                        {getMessage('optionsEnableAutoTranslateWebpageDescription')}
                    </div>
                    <div className='mt10-ml30'>
                        <HostList
                            list={autoTranslateWebpageHostList}
                            updateList={list => scOptions.set({ autoTranslateWebpageHostList: list })}
                        />
                    </div>
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsEnablePageTranslationCache')}
                    checked={enablePageTranslationCache}
                    onChange={v => scOptions.set({ enablePageTranslationCache: v })}
                />
                <div className='item-description'>
                    {getMessage('optionsEnablePageTranslationCacheDescription')}
                </div>
                <div className='mt10-ml30'>
                    <Button
                        variant='outlined'
                        onClick={() => setReadyToClearCache(true)}
                    >
                        {getMessage('optionsClearTranslationCache')}
                    </Button>
                    {readyToClearCache && <ConfirmDelete
                        onConfirm={() => {
                            scIndexedDB.clear('page-translation-cache');

                            setReadyToClearCache(false);
                        }}
                        onCancel={() => setReadyToClearCache(false)}
                        onClose={() => setReadyToClearCache(false)}
                        drawerTitle={getMessage('optionsConfirmClearTranslationCache')}
                    />}
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsSpecifyTranslate')}
                <BetaIcon />
                <div className='mt10-ml30'>
                    <SpecifyRule />
                </div>
            </div>
        </div>
    );
};

export default WebPageTranslating;