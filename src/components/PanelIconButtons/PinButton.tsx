import React from 'react';
import { useAppDispatch, useAppSelector } from '../../public/react-use';
import { setPanelPinning } from '../../redux/slice/panelStatusSlice';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const PinButton: React.FC = () => {
    const { pinning } = useAppSelector(store => store.panelStatus);

    const dispatch = useAppDispatch();

    return (
        <PanelIconButtonWrapper
            onClick={() => dispatch(setPanelPinning({ pinning: !pinning }))}
            iconGrey={!pinning}
        >
            <IconFont
                iconName='#icon-GoPin'
                style={pinning ? {transform: 'rotate(-45deg)'} : undefined}
            />
        </PanelIconButtonWrapper>
    );
};

export default PinButton;