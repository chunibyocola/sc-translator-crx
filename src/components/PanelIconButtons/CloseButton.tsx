import React from 'react';
import { useAppDispatch } from '../../public/react-use';
import { closePanel } from '../../redux/slice/panelStatusSlice';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const CloseButton: React.FC = () => {
    const dispatch = useAppDispatch();

    return (
        <PanelIconButtonWrapper
            onClick={() => dispatch(closePanel())}
        >
            <IconFont
                iconName='#icon-GoX'
            />
        </PanelIconButtonWrapper>
    );
};

export default CloseButton;