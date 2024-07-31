import React, { useState } from 'react';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const useOptionsDependency: GetStorageKeys<
    'autoPasteInTheInputBox'
> = [
    'autoPasteInTheInputBox'
];

const Clipboard: React.FC = () => {
    const [error, setError] = useState(false);

    const {
        autoPasteInTheInputBox
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsReadClipboardAutomatically')}
                    checked={autoPasteInTheInputBox}
                    onChange={() => {
                        if (autoPasteInTheInputBox) {
                            scOptions.set({ autoPasteInTheInputBox: false });
                        }
                        else {
                            navigator.clipboard.readText().then(() => {
                                error && setError(false);
                                scOptions.set({ autoPasteInTheInputBox: true });
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