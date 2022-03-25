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
            iconGrey={!displayEditArea}
        >
            <IconFont
                iconName='#icon-GoChevronDown'
                style={displayEditArea ? {transform: 'rotate(180deg)'} : undefined}
            />
        </PanelIconButtonWrapper>
    );
};

export default DisplayEditAreaButton;