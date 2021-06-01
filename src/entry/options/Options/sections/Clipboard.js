import React from 'react';
import { SCTS_REMOVE_SINGLE_PERMISSION, SCTS_REQUEST_SINGLE_PERMISSION } from '../../../../constants/chromeSendMessageTypes';
import OptionToggle from '../../OptionToggle';

const Clipboard = ({ clipboardRead, clipboardWrite }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='allow-extension-to-read-clipboard'
                    message='optionsAllowExtensionToReadClipboard'
                    checked={clipboardRead}
                    onClick={() => sendToBackground(clipboardRead ? SCTS_REMOVE_SINGLE_PERMISSION : SCTS_REQUEST_SINGLE_PERMISSION, 'clipboardRead')}
                />
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