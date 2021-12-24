import React from 'react';
import Button from '../../../../components/Button';
import { SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS } from '../../../../constants/chromeSendMessageTypes';
import { getMessage } from '../../../../public/i18n';
import BetaIcon from '../../BetaIcon';

const More: React.FC = () => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsEncourage')}</div>
            </div>
            <div className='opt-section-row'>
                <a
                    target='_blank'
                    href='https://github.com/chunibyocola/sc-translator-crx/issues'
                    rel='noreferrer'
                >
                    {getMessage('optionsMoreFeaturesOrBugReports')}
                </a>
            </div>
            <div className='opt-section-row'>
                <a
                    target='_blank'
                    href='https://github.com/chunibyocola/sc-translator-crx/blob/master/CHANGELOG.md'
                    rel='noreferrer'
                >
                    {getMessage('optionsChangeLog')}
                </a>
            </div>
            <div className='opt-section-row'>
                <Button
                    variant='outlined'
                    onClick={() => chrome.runtime.sendMessage({ type: SCTS_SYNC_SETTINGS_TO_OTHER_BROWSERS })}
                >
                    {getMessage('optionsSyncSettingsToOtherBrowsers')}
                </Button>
                <BetaIcon />
                <div className='item-description'>{getMessage('optionsSyncSettingsToOtherBrowsersDescription')}</div>
            </div>
        </div>
    );
};

export default More;