import React, { useEffect, useState } from 'react';
import { EXECUTE_BROWSER_ACTION, SC_AUDIO, SC_CALL_OUT, SC_CLOSE, SC_OPEN_SEPARATE_WINDOW, SC_TRANSLATE } from '../../../../constants/commandsName';
import { createNewTab, getAllCommands } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';

const KeyboardShortcut = () => {
    const [commands, setCommands] = useState({});

    useEffect(() => {
        getAllCommands((commands) => {
            setCommands(commands.reduce((t, v) => ({ ...t, [v.name]: v.shortcut }), {}));
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
            <div className='item-description opt-section-row'>
                <span onClick={() => createNewTab('chrome://extensions/shortcuts')} className='span-link'>
                    {getMessage('optionsCustomizeHere')}
                </span>
            </div>
        </div>
    );
};

export default KeyboardShortcut;