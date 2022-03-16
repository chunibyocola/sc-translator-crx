import React from 'react';
import { useAppDispatch, useAppSelector } from '../../public/react-use';
import { toggleDisplayEditArea } from '../../redux/slice/panelStatusSlice';
import IconFont from '../IconFont';

const DisplayEditAreaButton: React.FC = () => {
    const { displayEditArea } = useAppSelector(store => store.panelStatus);

    const dispatch = useAppDispatch();

    return (
        <IconFont
            iconName='#icon-GoChevronDown'
            onClick={() => dispatch(toggleDisplayEditArea())}
            style={displayEditArea ? {transform: 'rotate(180deg)', opacity: '1'} : {opacity: '0.6'}}
            className='button'
        />
    );
};

export default DisplayEditAreaButton;