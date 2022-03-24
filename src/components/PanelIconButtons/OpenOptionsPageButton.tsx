import React from 'react';
import { getMessage } from '../../public/i18n';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const OpenOptionsPageButton: React.FC = () => {
    return (
        <PanelIconButtonWrapper
            onClick={() => chrome.runtime.openOptionsPage()}
            title={getMessage('popupOpenOptionsPage')}
        >
            <IconFont
                iconName='#icon-MdSettings'
            />
        </PanelIconButtonWrapper>
    );
};

export default OpenOptionsPageButton;