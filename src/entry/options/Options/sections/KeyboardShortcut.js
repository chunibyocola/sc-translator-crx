import React, { useEffect, useState } from 'react';
import { EXECUTE_BROWSER_ACTION, SC_AUDIO, SC_CALL_OUT, SC_OPEN_SEPARATE_WINDOW, SC_TRANSLATE } from '../../../../constants/commandsName';
import { createNewTab, getAllCommands, getI18nMessage } from '../../../../public/chrome-call';

const KeyboardShortcut = () => {
    const [commands, setCommands] = useState({});

    useEffect(() => {
        getAllCommands((commands) => {
            setCommands(commands.reduce((t, v) => ({ ...t, [v.name]: v.shortcut }), {}));
        });
    }, []);

    return (
        <>
            <h3>{getI18nMessage('optionsKeyboardShortcut')}</h3>
            <div className='opt-item'>
                {getI18nMessage('extActivateExtensionDescription')}
                <span className='keyboard-shortcut'>{commands[EXECUTE_BROWSER_ACTION] ?? ''}</span>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extTranslateCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_TRANSLATE] ?? ''}</span>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extListenCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_AUDIO] ?? ''}</span>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extCallOutCommandDescription')}
                <span className='keyboard-shortcut'>{commands[SC_CALL_OUT] ?? ''}</span>
                <div className='item-description'>{getI18nMessage('optionsCallOutCommandDescription')}</div>
            </div>
            <div className='opt-item'>
                {getI18nMessage('extOpenSeparateWindowDescription')}
                <span className='keyboard-shortcut'>{commands[SC_OPEN_SEPARATE_WINDOW] ?? ''}</span>
            </div>
            <div className='opt-item item-description'>
                <p onClick={() => createNewTab('chrome://extensions/shortcuts')} className='link-p'>
                    {getI18nMessage('optionsCustomizeHere')}
                </p>
            </div>
        </>
    );
};

export default KeyboardShortcut;