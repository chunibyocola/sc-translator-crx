import React, { useMemo } from 'react';
import { getMessage } from '../../public/i18n';
import { useOptions } from '../../public/react-use';
import { getIsEnabled } from '../../public/utils';
import { GetStorageKeys } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';
import scOptions from '../../public/sc-options';

const useOptionsDependency: GetStorageKeys<'translateBlackListMode' | 'translateHostList'> = ['translateBlackListMode', 'translateHostList'];


type ToggleTranslateButtonProps = {
    host: string;
};

const ToggleTranslateButton: React.FC<ToggleTranslateButtonProps> = ({ host }) => {
    const { translateBlackListMode, translateHostList } = useOptions(useOptionsDependency);

    const translateEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, translateHostList, translateBlackListMode);
    }, [host, translateBlackListMode, translateHostList]);

    return (
        <PanelIconButtonWrapper
            disabled={!host}
            onClick={() => {
                if (!host) { return; }

                if ((translateEnabled && !translateBlackListMode) || (!translateEnabled && translateBlackListMode)) {
                    scOptions.set({ translateHostList: translateHostList.filter(v => !host.endsWith(v)) });
                }
                else {
                    scOptions.set({ translateHostList: translateHostList.concat(host) });
                }
            }}
            title={getMessage(host ? translateEnabled ? 'popupDisableTranslate' : 'popupEnableTranslate' : 'popupNotAvailable')}
            iconGrey={!translateEnabled}
        >
            <IconFont
                iconName='#icon-MdTranslate'
            />
        </PanelIconButtonWrapper>
    );
};

export default ToggleTranslateButton;