import React from 'react';
import Button from '../../../../components/Button';
import { getMessage } from '../../../../public/i18n';
import { sendSyncSettingsToOtherBrowsers } from '../../../../public/send';
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
                    onClick={sendSyncSettingsToOtherBrowsers}
                >
                    {getMessage('optionsSyncSettingsToOtherBrowsers')}
                </Button>
                <BetaIcon />
            </div>
        </div>
    );
};

export default SyncSettings;