import React from 'react';
import Button from '../../../../components/Button';
import { SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS } from '../../../../constants/chromeSendMessageTypes';
import { getMessage } from '../../../../public/i18n';
import BetaIcon from '../../BetaIcon';

type SyncSettingsProps = {};

const SyncSettings: React.FC<SyncSettingsProps> = () => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsSyncSettingsToOtherBrowsersDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <Button
                    variant='outlined'
                    onClick={() => chrome.runtime.sendMessage({ type: SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS })}
                >
                    {getMessage('optionsSyncSettingsToOtherBrowsers')}
                </Button>
                <BetaIcon />
            </div>
        </div>
    );
};

export default SyncSettings;