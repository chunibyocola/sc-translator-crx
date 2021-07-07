import React from 'react';
import IconFont from '../../../components/IconFont';
import { getMessage } from '../../../public/i18n';

const BetaIcon: React.FC = () => {
    return (
        <IconFont
            iconName='#icon-beta'
            title={getMessage('optionsBeta')}
            style={{margin: '0 5px', cursor: 'help', fontSize: '20px'}}
        />
    );
};

export default BetaIcon;