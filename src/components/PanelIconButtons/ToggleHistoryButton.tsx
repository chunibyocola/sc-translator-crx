import React, { useMemo } from 'react';
import { setLocalStorage } from '../../public/chrome-call';
import { getMessage } from '../../public/i18n';
import { useOptions } from '../../public/react-use';
import { getIsEnabled } from '../../public/utils';
import { GetStorageKeys } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const useOptionsDependency: GetStorageKeys<'historyBlackListMode' | 'historyHostList'> = ['historyBlackListMode', 'historyHostList'];


type ToggleHistoryButtonProps = {
    host: string;
};

const ToggleHistoryButton: React.FC<ToggleHistoryButtonProps> = ({ host }) => {
    const { historyBlackListMode, historyHostList } = useOptions(useOptionsDependency);

    const historyEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, historyHostList, historyBlackListMode);
    }, [host, historyBlackListMode, historyHostList]);

    return (
        <PanelIconButtonWrapper
            disabled={!host}
            onClick={() => {
                if (!host) { return; }

                if ((historyEnabled && !historyBlackListMode) || (!historyEnabled && historyBlackListMode)) {
                    setLocalStorage({ historyHostList: historyHostList.filter(v => !host.endsWith(v)) });
                }
                else {
                    setLocalStorage({ historyHostList: historyHostList.concat(host) });
                }
            }}
            title={getMessage(host ? historyEnabled ? 'popupDisableHistory' : 'popupEnableHistory' : 'popupNotAvailable')}
            iconGrey={!historyEnabled}
        >
            <IconFont
                iconName='#icon-MdHistory'
            />
        </PanelIconButtonWrapper>
    );
};

export default ToggleHistoryButton;