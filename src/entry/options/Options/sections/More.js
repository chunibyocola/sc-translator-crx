import React from 'react';
import { getMessage } from '../../../../public/i18n';

const More = () => {
    return (
        <>
            <h3>{getMessage('optionsMoreFeaturesOrBugReports')}</h3>
            <div className='opt-item'>
                <a
                    target='_blank'
                    href='https://github.com/chunibyocola/sc-translator-crx/issues'
                    rel="noopener noreferrer"
                >
                    sc-translator-crx
                </a>
            </div>
        </>
    );
};

export default More;