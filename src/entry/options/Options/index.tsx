import React, { useCallback } from 'react';
import defaultOptions from '../../../constants/defaultOptions';
import { setLocalStorage } from '../../../public/chrome-call';
import { getMessage } from '../../../public/i18n';
import { useOptions } from '../../../public/react-use';
import OptionsMenu from '../OptionsMenu';
import OverScroll from '../OverScroll';
import Audio from './sections/Audio';
import ContextMenus from './sections/ContextMenus';
import DefaultTranslateOptions from './sections/DefaultTranslateOptions';
import History from './sections/History';
import KeyboardShortcut from './sections/KeyboardShortcut';
import More from './sections/More';
import Pdf from './sections/Pdf';
import SeparateWindow from './sections/SeparateWindow';
import Theme from './sections/Theme';
import Translate from './sections/Translate';
import TranslatePanel from './sections/TranslatePanel';
import Clipboard from './sections/Clipboard';
import './style.css';
import { DefaultOptions } from '../../../types';
import WebPageTranslating from './sections/WebPageTranslating';
import TextPreprocessing from './sections/TextPreprocessing';
import SyncSettings from './sections/SyncSettings';
import Logo from '../../../components/Logo';

export type GenericOptionsProps<T> = {
    updateStorage: (key: string, value: any) => void;
} & T;

const useOptionsDependency = Object.keys(defaultOptions) as (keyof DefaultOptions)[];

const Options: React.FC = () => {
    const {
        userLanguage,
        defaultTranslateSource,
        defaultTranslateFrom,
        defaultTranslateTo,
        translateDirectly,
        translateBlackListMode,
        translateHostList,
        historyBlackListMode,
        historyHostList,
        defaultAudioSource,
        translateWithKeyPress,
        useDotCn,
        multipleTranslateMode,
        multipleTranslateSourceList,
        multipleTranslateFrom,
        multipleTranslateTo,
        enablePdfViewer,
        preferredLanguage,
        secondPreferredLanguage,
        styleVarsList,
        styleVarsIndex,
        btnPosition,
        audioVolume,
        audioPlaybackRate,
        hideButtonAfterFixedTime,
        hideButtonFixedTime,
        respondToSeparateWindow,
        rememberStwSizeAndPosition,
        pinThePanelWhileOpeningIt,
        rememberPositionOfPinnedPanel,
        translatePanelMaxHeight,
        translatePanelWidth,
        translatePanelFontSize,
        rememberHistoryPanelStatus,
        translateDirectlyWhilePinning,
        doNotRespondInTextBox,
        autoTranslateAfterInput,
        contextMenus,
        autoPasteInTheInputBox,
        enableInsertResult,
        autoInsertResult,
        textPreprocessingRegExpList,
        textPreprocessingPreset,
        customizeStyleText,
        translateButtons,
        webPageTranslateSource,
        webPageTranslateTo,
        webPageTranslateDisplayMode,
        webPageTranslateDirectly,
        noControlBarWhileFirstActivating,
        afterSelectingTextRegExpList,
        translateButtonsTL,
        customTranslateSourceList,
        displayOfTranslation
    } = useOptions<DefaultOptions>(useOptionsDependency);

    const updateStorage = useCallback((key, value) => (setLocalStorage({[key]: value})), []);

    return (
        <div className='options'>
            <div className='opt-nav-bar'>
                <OptionsMenu />
                <div className='main-title'>
                    <div className='flex-align-items-center'>
                        <Logo style={{fontSize: '30px', marginRight: '10px'}} />
                        {getMessage('optionsTitle')}
                    </div>
                </div>
            </div>
            <div className='sub-title'  id='theme'>{getMessage('optionsTheme')}</div>
            <Theme
                updateStorage={updateStorage}
                styleVarsList={styleVarsList}
                styleVarsIndex={styleVarsIndex}
                customizeStyleText={customizeStyleText}
            />
            <div className='sub-title' id='pdf'>PDF</div>
            <Pdf
                updateStorage={updateStorage}
                enablePdfViewer={enablePdfViewer}
            />
            <div className='sub-title' id='clipboard'>{getMessage('optionsClipboard')}</div>
            <Clipboard
                updateStorage={updateStorage}
                autoPasteInTheInputBox={autoPasteInTheInputBox}
            />
            <div className='sub-title' id='web-page-translating'>{getMessage('optionsWebPageTranslating')}</div>
            <WebPageTranslating
                updateStorage={updateStorage}
                webPageTranslateSource={webPageTranslateSource}
                webPageTranslateTo={webPageTranslateTo}
                webPageTranslateDisplayMode={webPageTranslateDisplayMode}
                userLanguage={userLanguage}
                webPageTranslateDirectly={webPageTranslateDirectly}
                noControlBarWhileFirstActivating={noControlBarWhileFirstActivating}
            />
            <div className='sub-title' id='audio'>{getMessage('optionsAudio')}</div>
            <Audio
                updateStorage={updateStorage}
                defaultAudioSource={defaultAudioSource}
                audioVolume={audioVolume}
                audioPlaybackRate={audioPlaybackRate}
            />
            <div className='sub-title' id='separate-window'>{getMessage('titleSeparateWindow')}</div>
            <SeparateWindow
                updateStorage={updateStorage}
                rememberStwSizeAndPosition={rememberStwSizeAndPosition}
            />
            <div className='sub-title' id='translate-panel'>{getMessage('optionsTranslatePanel')}</div>
            <TranslatePanel
                updateStorage={updateStorage}
                pinThePanelWhileOpeningIt={pinThePanelWhileOpeningIt}
                rememberPositionOfPinnedPanel={rememberPositionOfPinnedPanel}
                translatePanelMaxHeight={translatePanelMaxHeight}
                translatePanelWidth={translatePanelWidth}
                translatePanelFontSize={translatePanelFontSize}
                autoTranslateAfterInput={autoTranslateAfterInput}
            />
            <div className='sub-title' id='default-translate-options'>{getMessage('optionsDefaultTranslateOptions')}</div>
            <DefaultTranslateOptions
                updateStorage={updateStorage}
                multipleTranslateMode={multipleTranslateMode}
                userLanguage={userLanguage}
                preferredLanguage={preferredLanguage}
                secondPreferredLanguage={secondPreferredLanguage}
                multipleTranslateSourceList={multipleTranslateSourceList}
                multipleTranslateFrom={multipleTranslateFrom}
                multipleTranslateTo={multipleTranslateTo}
                defaultTranslateSource={defaultTranslateSource}
                defaultTranslateFrom={defaultTranslateFrom}
                defaultTranslateTo={defaultTranslateTo}
                useDotCn={useDotCn}
                customTranslateSourceList={customTranslateSourceList}
                displayOfTranslation={displayOfTranslation}
            />
            <div className='sub-title' id='text-preprocessing'>{getMessage('optionsTextPreprocessing')}</div>
            <TextPreprocessing
                updateStorage={updateStorage}
                textPreprocessingRegExpList={textPreprocessingRegExpList}
                textPreprocessingPreset={textPreprocessingPreset}
                afterSelectingTextRegExpList={afterSelectingTextRegExpList}
            />
            <div className='sub-title' id='in-web-page'>{getMessage('optionsInWebPage')}</div>
            <Translate
                updateStorage={updateStorage}
                translateWithKeyPress={translateWithKeyPress}
                translateDirectly={translateDirectly}
                btnPosition={btnPosition}
                hideButtonAfterFixedTime={hideButtonAfterFixedTime}
                hideButtonFixedTime={hideButtonFixedTime}
                translateBlackListMode={translateBlackListMode}
                translateHostList={translateHostList}
                respondToSeparateWindow={respondToSeparateWindow}
                translateDirectlyWhilePinning={translateDirectlyWhilePinning}
                doNotRespondInTextBox={doNotRespondInTextBox}
                enableInsertResult={enableInsertResult}
                autoInsertResult={autoInsertResult}
                translateButtons={translateButtons}
                translateButtonsTL={translateButtonsTL}
                userLanguage={userLanguage}
            />
            <div className='sub-title' id='history'>{getMessage('optionsHistory')}</div>
            <History
                updateStorage={updateStorage}
                historyBlackListMode={historyBlackListMode}
                historyHostList={historyHostList}
                rememberHistoryPanelStatus={rememberHistoryPanelStatus}
            />
            <div className='sub-title' id='context-menus'>{getMessage('optionsContextMenus')}</div>
            <ContextMenus
                updateStorage={updateStorage}
                contextMenus={contextMenus}
            />
            <div className='sub-title' id='keyboard-shortcut'>{getMessage('optionsKeyboardShortcut')}</div>
            <KeyboardShortcut />
            <div className='sub-title' id='sync-settings'>{getMessage('optionsSyncSettings')}</div>
            <SyncSettings />
            <div className='sub-title' id='more'>{getMessage('optionsMore')}</div>
            <More />
            <OverScroll />
        </div>
    );
};

export default Options;