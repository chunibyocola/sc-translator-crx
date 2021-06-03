import React from 'react';
import { getMessage } from '../../../../public/i18n';
import OptionToggle from '../../OptionToggle';

const Clipboard = ({ updateStorage, clipboardReadPermission, autoPasteInTheInputBox }) => {
    const updateClipboardReadPermission = () => {
        if (clipboardReadPermission) {
            chrome.permissions.remove({ permissions: ['clipboardRead'] }, removed => removed && updateStorage('clipboardReadPermission', false));
        }
        else {
            chrome.permissions.request({ permissions: ['clipboardRead'] }, granted => granted && updateStorage('clipboardReadPermission', true));
        }
    };

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='allow-extension-to-read-clipboard'
                    message='optionsAllowExtensionToReadClipboard'
                    checked={clipboardReadPermission}
                    onClick={updateClipboardReadPermission}
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
        </div>
    );
};

export default Clipboard;