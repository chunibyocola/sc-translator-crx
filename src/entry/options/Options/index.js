import React, { useCallback } from 'react';
import defaultOptions from '../../../constants/defaultOptions';
import { setLocalStorage } from '../../../public/chrome-call';
import { getMessage } from '../../../public/i18n';
import { useOptions } from '../../../public/react-use';
import Audio from './sections/Audio';
import History from './sections/History';
import KeyboardShortcut from './sections/KeyboardShortcut';
import More from './sections/More';
import Pdf from './sections/PDF';
import SeparateWindow from './sections/SeparateWindow';
import Theme from './sections/Theme';
import Translate from './sections/Translate';
import TranslatePanel from './sections/TranslatePanel';
import Url from './sections/URL';
import './style.css';

const useOptionsDependency = Object.keys(defaultOptions);

const Options = () => {
    const {
        userLanguage,
        enableContextMenus,
        defaultTranslateSource,
        defaultTranslateFrom,
        defaultTranslateTo,
        translateDirectly,
        translateBlackListMode,
        translateHostList,
        historyBlackListMode,
        historyHostList,
        showButtonAfterSelect,
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
        translatePanelMaxHeight
    } = useOptions(useOptionsDependency);

    const updateStorage = useCallback((key, value) => (setLocalStorage({[key]: value})), []);

    return (
        <div className='options'>
            <div className='main-title'>{getMessage('optionsTitle')}</div>
            <div className='sub-title'>{getMessage('optionsTheme')}</div>
            <Theme
                updateStorage={updateStorage}
                styleVarsList={styleVarsList}
                styleVarsIndex={styleVarsIndex}
            />
            <div className='sub-title'>URL</div>
            <Url
                updateStorage={updateStorage}
                useDotCn={useDotCn}
            />
            <div className='sub-title'>PDF</div>
            <Pdf
                updateStorage={updateStorage}
                enablePdfViewer={enablePdfViewer}
            />
            <div className='sub-title'>{getMessage('optionsAudio')}</div>
            <Audio
                updateStorage={updateStorage}
                defaultAudioSource={defaultAudioSource}
                audioVolume={audioVolume}
                audioPlaybackRate={audioPlaybackRate}
            />
            <div className='sub-title'>{getMessage('titleSeparateWindow')}</div>
            <SeparateWindow
                updateStorage={updateStorage}
                rememberStwSizeAndPosition={rememberStwSizeAndPosition}
            />
            <div className='sub-title'>{getMessage('optionsTranslatePanel')}</div>
            <TranslatePanel
                updateStorage={updateStorage}
                pinThePanelWhileOpeningIt={pinThePanelWhileOpeningIt}
                rememberPositionOfPinnedPanel={rememberPositionOfPinnedPanel}
                translatePanelMaxHeight={translatePanelMaxHeight}
            />
            <div className='sub-title'>{getMessage('optionsTranslate')}</div>
            <Translate
                updateStorage={updateStorage}
                translateWithKeyPress={translateWithKeyPress}
                enableContextMenus={enableContextMenus}
                translateDirectly={translateDirectly}
                showButtonAfterSelect={showButtonAfterSelect}
                btnPosition={btnPosition}
                hideButtonAfterFixedTime={hideButtonAfterFixedTime}
                hideButtonFixedTime={hideButtonFixedTime}
                multipleTranslateMode={multipleTranslateMode}
                userLanguage={userLanguage}
                preferredLanguage={preferredLanguage}
                multipleTranslateSourceList={multipleTranslateSourceList}
                multipleTranslateFrom={multipleTranslateFrom}
                multipleTranslateTo={multipleTranslateTo}
                defaultTranslateSource={defaultTranslateSource}
                defaultTranslateFrom={defaultTranslateFrom}
                defaultTranslateTo={defaultTranslateTo}
                translateBlackListMode={translateBlackListMode}
                translateHostList={translateHostList}
                respondToSeparateWindow={respondToSeparateWindow}
                secondPreferredLanguage={secondPreferredLanguage}
            />
            <div className='sub-title'>{getMessage('optionsHistory')}</div>
            <History
                updateStorage={updateStorage}
                historyBlackListMode={historyBlackListMode}
                historyHostList={historyHostList}
            />
            <div className='sub-title'>{getMessage('optionsKeyboardShortcut')}</div>
            <KeyboardShortcut />
            <div className='sub-title'>{getMessage('optionsMoreFeaturesOrBugReports')}</div>
            <More />
        </div>
    );
};

export default Options;