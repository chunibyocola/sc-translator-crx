import React from 'react';
import { setLocalStorage } from '../../public/chrome-call';
import { getMessage } from '../../public/i18n';
import { useOptions } from '../../public/react-use';
import { DefaultOptions } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

type PickedOptions = Pick<DefaultOptions, 'styleVarsList' | 'styleVarsIndex'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['styleVarsList', 'styleVarsIndex'];

const SwitchThemeButton: React.FC = () => {
    const { styleVarsList, styleVarsIndex } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <PanelIconButtonWrapper
            onClick={() => setLocalStorage({ styleVarsIndex: styleVarsList.length - 1 > styleVarsIndex ? styleVarsIndex + 1 : 0 })}
            title={getMessage('popupSwitchToTheNextTheme')}
        >
            <IconFont
                iconName='#icon-theme'
            />
        </PanelIconButtonWrapper>
    );
};

export default SwitchThemeButton;