import React from 'react';
import { getMessage } from '../../../../public/i18n';

const More: React.FC = () => {
    return (
        <div className='opt-section'>
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
        </div>
    );
};

export default More;