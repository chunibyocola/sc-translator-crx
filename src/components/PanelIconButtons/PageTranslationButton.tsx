import React from 'react';
import { getMessage } from '../../public/i18n';
import { sendTabsTranslateCurrentPage } from '../../public/send';
import { getCurrentTab } from '../../public/utils';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

type PageTranslationButtonProps = {
    host: string;
};

const PageTranslationButton: React.FC<PageTranslationButtonProps> = ({ host }) => {
    return (
        <PanelIconButtonWrapper
            disabled={!host}
            onClick={() => {
                host && getCurrentTab(tab => tab?.id !== undefined && sendTabsTranslateCurrentPage(tab.id));
            }}
            title={host ? getMessage('contextMenus_TRANSLATE_CURRENT_PAGE') : getMessage('popupNotAvailable')}
        >
            <IconFont iconName='#icon-pageTranslation' />
        </PanelIconButtonWrapper>
    );
};

export default PageTranslationButton;