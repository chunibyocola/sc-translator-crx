import React, { useState, useEffect, useCallback } from 'react';
import IconFont from '../IconFont';
import { setLocalStorage, openOptionsPage } from '../../public/chrome-call';
import { useOptions } from '../../public/react-use';
import { getCurrentTabHost } from '../../public/utils';
import './style.css';
import { getMessage } from '../../public/i18n';
import { DefaultOptions } from '../../types';
import CollectButton from '../PanelIconButtons/CollectButton';
import ToggleTranslateButton from '../PanelIconButtons/ToggleTranslateButton';
import ToggleHistoryButton from '../PanelIconButtons/ToggleHistoryButton';

type PickedOptions = Pick<DefaultOptions, 'styleVarsList' | 'styleVarsIndex'>;
const useOptionsDependency: (keyof PickedOptions)[] = ['styleVarsList', 'styleVarsIndex'];

const PopupHeader: React.FC = () => {
    const [host, setHost] = useState('');

    const { styleVarsList, styleVarsIndex } = useOptions<PickedOptions>(useOptionsDependency);

    useEffect(() => {
        getCurrentTabHost().then(tabHost => setHost(tabHost));
    }, []);

    const handleThemeToggle = useCallback(() => {
        setLocalStorage({ 'styleVarsIndex': styleVarsIndex >= styleVarsList.length - 1 ? 0 : styleVarsIndex + 1 });
    }, [styleVarsList, styleVarsIndex]);

    return (
        <div className="popup-header flex-justify-content-space-between">
            <div className='popup-header__logo flex-align-items-center'>Sc</div>
            <div className='popup-header__icons flex-align-items-center'>
                <CollectButton />
                <IconFont
                    iconName='#icon-theme'
                    className='iconfont--enable'
                    onClick={() => handleThemeToggle()}
                    title={getMessage('popupSwitchToTheNextTheme')}
                />
                <ToggleTranslateButton host={host} />
                <ToggleHistoryButton host={host} />
                <IconFont
                    iconName='#icon-MdSettings'
                    className='iconfont--enable'
                    onClick={openOptionsPage}
                    title={getMessage('popupOpenOptionsPage')}
                />
            </div>
        </div>
    );
};

export default PopupHeader;