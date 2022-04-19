import React, { useState, useEffect } from 'react';
import { getCurrentTabHost } from '../../public/utils';
import './style.css';
import CollectButton from '../PanelIconButtons/CollectButton';
import ToggleTranslateButton from '../PanelIconButtons/ToggleTranslateButton';
import ToggleHistoryButton from '../PanelIconButtons/ToggleHistoryButton';
import OpenOptionsPageButton from '../PanelIconButtons/OpenOptionsPageButton';
import SwitchThemeButton from '../PanelIconButtons/SwitchThemeButton';
import OpenCollectionPageButton from '../PanelIconButtons/OpenCollectionPageButton';

const PopupHeader: React.FC = () => {
    const [host, setHost] = useState('');

    useEffect(() => {
        getCurrentTabHost().then(tabHost => setHost(tabHost));
    }, []);

    return (
        <div className="popup-header flex-justify-content-space-between">
            <div className='popup-header__logo flex-align-items-center'></div>
            <div className='popup-header__icons flex-align-items-center'>
                <CollectButton />
                <OpenCollectionPageButton />
                <SwitchThemeButton />
                <ToggleTranslateButton host={host} />
                <ToggleHistoryButton host={host} />
                <OpenOptionsPageButton />
            </div>
        </div>
    );
};

export default PopupHeader;