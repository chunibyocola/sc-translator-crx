import React from 'react';
import { getMessage } from '../../../public/i18n';
import OptionsMenu from '../components/OptionsMenu';
import OverScroll from '../components/OverScroll';
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
import WebPageTranslating from './sections/WebPageTranslating';
import TextPreprocessing from './sections/TextPreprocessing';
import SyncSettings from './sections/SyncSettings';
import Logo from '../../../components/Logo';

const Options: React.FC = () => {
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
            <Theme />
            <div className='sub-title' id='pdf'>PDF</div>
            <Pdf />
            <div className='sub-title' id='clipboard'>{getMessage('optionsClipboard')}</div>
            <Clipboard />
            <div className='sub-title' id='web-page-translating'>{getMessage('optionsWebPageTranslating')}</div>
            <WebPageTranslating />
            <div className='sub-title' id='audio'>{getMessage('optionsAudio')}</div>
            <Audio />
            <div className='sub-title' id='separate-window'>{getMessage('titleSeparateWindow')}</div>
            <SeparateWindow />
            <div className='sub-title' id='translate-panel'>{getMessage('optionsTranslatePanel')}</div>
            <TranslatePanel />
            <div className='sub-title' id='default-translate-options'>{getMessage('optionsDefaultTranslateOptions')}</div>
            <DefaultTranslateOptions />
            <div className='sub-title' id='text-preprocessing'>{getMessage('optionsTextPreprocessing')}</div>
            <TextPreprocessing />
            <div className='sub-title' id='in-web-page'>{getMessage('optionsInWebPage')}</div>
            <Translate />
            <div className='sub-title' id='history'>{getMessage('optionsHistory')}</div>
            <History />
            <div className='sub-title' id='context-menus'>{getMessage('optionsContextMenus')}</div>
            <ContextMenus />
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