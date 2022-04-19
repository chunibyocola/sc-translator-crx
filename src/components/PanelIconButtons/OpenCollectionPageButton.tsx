import React from 'react';
import { getMessage } from '../../public/i18n';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const OpenCollectionPageButton: React.FC = () => {
    return (
        <PanelIconButtonWrapper
            onClick={() => chrome.tabs.create({ url: chrome.runtime.getURL('/collection.html') })}
            title={getMessage('popupOpenCollectionPage')}
        >
            <IconFont iconName='#icon-collections' />
        </PanelIconButtonWrapper>
    );
};

export default OpenCollectionPageButton;