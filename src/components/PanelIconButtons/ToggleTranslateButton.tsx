import React, { useMemo } from 'react';
import { setLocalStorage } from '../../public/chrome-call';
import { getMessage } from '../../public/i18n';
import { useOptions } from '../../public/react-use';
import { getIsEnabled } from '../../public/utils';
import { DefaultOptions } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

type PickedOptions = Pick<DefaultOptions, 'translateBlackListMode' | 'translateHostList'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['translateBlackListMode', 'translateHostList'];


type ToggleTranslateButtonProps = {
    host: string;
};

const ToggleTranslateButton: React.FC<ToggleTranslateButtonProps> = ({ host }) => {
    const { translateBlackListMode, translateHostList } = useOptions<PickedOptions>(useOptionsDependency);

    const translateEnabled = useMemo(() => {
        return !!host && getIsEnabled(host, translateHostList, translateBlackListMode);
    }, [host, translateBlackListMode, translateHostList]);

    return (
        <PanelIconButtonWrapper
            disabled={!host}
            onClick={() => {
                if (!host) { return; }

                if ((translateEnabled && !translateBlackListMode) || (!translateEnabled && translateBlackListMode)) {
                    setLocalStorage({ translateHostList: translateHostList.filter(v => !host.endsWith(v)) });
                }
                else {
                    setLocalStorage({ translateHostList: translateHostList.concat(host) });
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