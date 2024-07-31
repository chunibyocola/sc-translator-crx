import React from 'react';
import { getMessage } from '../../public/i18n';
import { useOptions } from '../../public/react-use';
import { GetStorageKeys } from '../../types';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';
import scOptions from '../../public/sc-options';

const useOptionsDependency: GetStorageKeys<'styleVarsList' | 'styleVarsIndex'> = ['styleVarsList', 'styleVarsIndex'];

const SwitchThemeButton: React.FC = () => {
    const { styleVarsList, styleVarsIndex } = useOptions(useOptionsDependency);

    return (
        <PanelIconButtonWrapper
            onClick={() => scOptions.set({ styleVarsIndex: styleVarsList.length - 1 > styleVarsIndex ? styleVarsIndex + 1 : 0 })}
            title={getMessage('popupSwitchToTheNextTheme')}
        >
            <IconFont
                iconName='#icon-theme'
            />
        </PanelIconButtonWrapper>
    );
};

export default SwitchThemeButton;