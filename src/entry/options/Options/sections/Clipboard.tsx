import React, { useState } from 'react';
import { GenericOptionsProps } from '..';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import OptionToggle from '../../OptionToggle';

type ClipboardProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'autoPasteInTheInputBox'
>>;

const Clipboard: React.FC<ClipboardProps> = ({ updateStorage, autoPasteInTheInputBox }) => {
    const [error, setError] = useState(false);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='read-clipboard-automatically'
                    message='optionsReadClipboardAutomatically'
                    checked={autoPasteInTheInputBox}
                    onClick={() => {
                        if (autoPasteInTheInputBox) {
                            updateStorage('autoPasteInTheInputBox', false);
                        }
                        else {
                            navigator.clipboard.readText().then(() => {
                                error && setError(false);
                                updateStorage('autoPasteInTheInputBox', true);
                            }).catch(() => {
                                setError(true);
                            });
                        }
                    }}
                />
                <div className='item-description'>{getMessage('optionsReadClipboardAutomaticallyDescription')}</div>
                {error && <div className='item-description'>
                    {getMessage('optionsAutoPasteInTheInputBoxErrorDescription')}
                    <span onClick={() => chrome.tabs.create({ url: 'chrome://settings/content/clipboard' })} className='span-link'>
                        settings/content/clipboard
                    </span>
                </div>}
            </div>
        </div>
    );
};

export default Clipboard;