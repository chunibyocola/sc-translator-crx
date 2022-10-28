import React, { useEffect, useState } from 'react';
import { getMessage } from '../../public/i18n';
import { getCurrentTab } from '../../public/utils';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

type PageTranslationButtonProps = {
    host: string;
};

const PageTranslationButton: React.FC<PageTranslationButtonProps> = ({ host }) => {
    const [activated, setActivated] = useState(false);
    const [tabId, setTabId] = useState<number>();

    useEffect(() => {
        if (!host) { return; }

        getCurrentTab((tab) => {
            tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, 'Have you activated?', (response) => {
                if (chrome.runtime.lastError) { return; }

                setActivated(response === 'Yes!');
                setTabId(tab.id);
            });
        });
    }, [host]);

    return (
        <PanelIconButtonWrapper
            disabled={tabId === undefined}
            onClick={() => {
                if (tabId === undefined) { return; }

                chrome.tabs.sendMessage(tabId, activated ? 'Close page translation!' : 'Activate page translation!');

                window.close();
            }}
            title={getMessage(tabId !== undefined ? activated ? 'contentCloseWebPageTranslating' : 'contextMenus_TRANSLATE_CURRENT_PAGE' : 'popupNotAvailable')}
            iconGrey={!activated}
        >
            <IconFont iconName='#icon-pageTranslation' />
        </PanelIconButtonWrapper>
    );
};

export default PageTranslationButton;