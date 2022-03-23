import React, { useMemo } from 'react';
import { setLocalStorage } from '../../public/chrome-call';
import { getMessage } from '../../public/i18n';
import { useOptions } from '../../public/react-use';
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
        if (!host) { return false; }

        const found = translateHostList.some(v => host.endsWith(v));

        return translateBlackListMode ? !found : found;
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
        >
            <IconFont
                iconName='#icon-MdTranslate'
                style={host ? { opacity: translateEnabled ? 0.7 : 0.4 } : undefined}
                title={getMessage(host ? translateEnabled ? 'popupDisableTranslate' : 'popupEnableTranslate' : 'popupNotAvailable')}
            />
        </PanelIconButtonWrapper>
    );
};

export default ToggleTranslateButton;