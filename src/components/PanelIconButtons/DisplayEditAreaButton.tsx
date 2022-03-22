import React from 'react';
import { useAppDispatch, useAppSelector } from '../../public/react-use';
import { toggleDisplayEditArea } from '../../redux/slice/panelStatusSlice';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const DisplayEditAreaButton: React.FC = () => {
    const { displayEditArea } = useAppSelector(store => store.panelStatus);

    const dispatch = useAppDispatch();

    return (
        <PanelIconButtonWrapper
            onClick={() => dispatch(toggleDisplayEditArea())}
        >
            <IconFont
                iconName='#icon-GoChevronDown'
                style={displayEditArea ? {transform: 'rotate(180deg)', opacity: '1'} : {opacity: '0.6'}}
            />
        </PanelIconButtonWrapper>
    );
};

export default DisplayEditAreaButton;