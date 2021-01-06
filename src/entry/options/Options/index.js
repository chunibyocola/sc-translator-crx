import React, { useCallback } from 'react';
import defaultOptions from '../../../constants/defaultOptions';
import { setLocalStorage, getI18nMessage } from '../../../public/chrome-call';
import { useOptions } from '../../../public/react-use';
import Audio from './sections/Audio';
import History from './sections/History';
import KeyboardShortcut from './sections/KeyboardShortcut';
import More from './sections/More';
import Pdf from './sections/PDF';
import Theme from './sections/Theme';
import Translate from './sections/Translate';
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
        styleVarsList,
        styleVarsIndex,
        btnPosition,
        audioVolume,
        audioPlaybackRate,
        hideButtonAfterFixedTime,
        hideButtonFixedTime
    } = useOptions(useOptionsDependency);

    const updateStorage = useCallback((key, value) => (setLocalStorage({[key]: value})), []);

    return (
        <div className='options'>
            <h2>{getI18nMessage('optionsTitle')}</h2>
            <Theme
                updateStorage={updateStorage}
                styleVarsList={styleVarsList}
                styleVarsIndex={styleVarsIndex}
            />
            <Url
                updateStorage={updateStorage}
                useDotCn={useDotCn}
            />
            <Pdf
                updateStorage={updateStorage}
                enablePdfViewer={enablePdfViewer}
            />
            <Audio
                updateStorage={updateStorage}
                defaultAudioSource={defaultAudioSource}
                audioVolume={audioVolume}
                audioPlaybackRate={audioPlaybackRate}
            />
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
            />
            <History
                updateStorage={updateStorage}
                historyBlackListMode={historyBlackListMode}
                historyHostList={historyHostList}
            />
            <KeyboardShortcut />
            <More />
        </div>
    );
};

export default Options;