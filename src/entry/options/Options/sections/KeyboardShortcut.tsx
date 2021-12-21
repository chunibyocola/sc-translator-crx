import React, { useEffect, useState } from 'react';
import Button from '../../../../components/Button';
import {
    EXECUTE_BROWSER_ACTION,
    SC_AUDIO, SC_CALL_OUT,
    SC_CLOSE, SC_OPEN_SEPARATE_WINDOW,
    SC_SWITCH_WT_DISPLAY_MODE,
    SC_TOGGLE_AUTO_INSERT_RESULT,
    SC_TRANSLATE,
    SC_TRANSLATE_CURRENT_PAGE
} from '../../../../constants/commandsName';
import { createNewTab, getAllCommands } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';

const KeyboardShortcut: React.FC = () => {
    const [commands, setCommands] = useState<{ [key: string]: string; }>({});

    useEffect(() => {
        getAllCommands((commands) => {
            setCommands(commands.reduce((t: { [key: string]: string; }, v) => ((v.name && v.shortcut) ? { ...t, [v.name]: v.shortcut } : t), {}));
        });
    }, []);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                {getMessage('extActivateExtensionDescription')}
                <span className='keyboard-shortcut'>{commands[EXECUTE_BROWSER_ACTION]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extTranslateCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_TRANSLATE]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extListenCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_AUDIO]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extCallOutCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_CALL_OUT]}</span>
                <div className='item-description'>{getMessage('optionsCallOutCommandDescription')}</div>
            </div>
            <div className='opt-section-row'>
                {getMessage('extCloseCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_CLOSE]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extOpenSeparateWindowDescription')}
                <span className='keyboard-shortcut'>{commands[SC_OPEN_SEPARATE_WINDOW]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extToggleAutoInsertResultDescription')}
                <span className='keyboard-shortcut'>{commands[SC_TOGGLE_AUTO_INSERT_RESULT]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extTranslateCurrentPageDescription')}
                <span className='keyboard-shortcut'>{commands[SC_TRANSLATE_CURRENT_PAGE]}</span>
            </div>
            <div className='opt-section-row'>
                {getMessage('extSwitchWTDisplayModeDescription')}
                <span className='keyboard-shortcut'>{commands[SC_SWITCH_WT_DISPLAY_MODE]}</span>
            </div>
            <div className='opt-section-row'>
                <Button variant='outlined' onClick={() => createNewTab('chrome://extensions/shortcuts')}>
                    {getMessage('optionsCustomizeHere')}
                </Button>
            </div>
        </div>
    );
};

export default KeyboardShortcut;