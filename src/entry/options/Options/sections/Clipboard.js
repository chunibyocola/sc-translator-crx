import React from 'react';
import { SCTS_REMOVE_SINGLE_PERMISSION, SCTS_REQUEST_SINGLE_PERMISSION } from '../../../../constants/chromeSendMessageTypes';
import { getMessage } from '../../../../public/i18n';
import OptionToggle from '../../OptionToggle';

const Clipboard = ({ updateStorage, clipboardRead, clipboardWrite, autoPasteInTheInputBox }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='allow-extension-to-read-clipboard'
                    message='optionsAllowExtensionToReadClipboard'
                    checked={clipboardRead}
                    onClick={() => sendToBackground(clipboardRead ? SCTS_REMOVE_SINGLE_PERMISSION : SCTS_REQUEST_SINGLE_PERMISSION, 'clipboardRead')}
                />
                <div className='mt10-ml30'>
                    <OptionToggle
                        id='read-clipboard-automatically'
                        message='optionsReadClipboardAutomatically'
                        checked={autoPasteInTheInputBox}
                        onClick={() => updateStorage('autoPasteInTheInputBox', !autoPasteInTheInputBox)}
                    />
                    <div className='item-description'>{getMessage('optionsReadClipboardAutomaticallyDescription')}</div>
                </div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='allow-extension-to-write-clipboard'
                    message='optionsAllowExtensionToWriteClipboard'
                    checked={clipboardWrite}
                    onClick={() => sendToBackground(clipboardWrite ? SCTS_REMOVE_SINGLE_PERMISSION : SCTS_REQUEST_SINGLE_PERMISSION, 'clipboardWrite')}
                />
            </div>
        </div>
    );
};

export default Clipboard;

const sendToBackground = (type, permissionName) => chrome.runtime.sendMessage({ type: type, payload: { permissionName } });