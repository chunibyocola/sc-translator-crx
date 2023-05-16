import React from 'react';
import { getMessage } from '../../public/i18n';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';
import { openCollectionPage } from '../../public/utils';

const OpenCollectionPageButton: React.FC = () => {
    return (
        <PanelIconButtonWrapper
            onClick={openCollectionPage}
            title={getMessage('popupOpenCollectionPage')}
        >
            <IconFont iconName='#icon-collections' />
        </PanelIconButtonWrapper>
    );
};

export default OpenCollectionPageButton;