import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import LSelect from './LSelect';
import IconFont from '../IconFont';
import {
    translationSwapFromAndTo
} from '../../redux/actions/translationActions';
import './style.css';

const LanguageSelection = ({selectionChange, disableSelect}) => {
    const {from, to} = useSelector(state => state.translationState);

    const dispatch = useDispatch();

    return (
        <div className='ts-language-selection'>
            <LSelect onChange={selectionChange} disableSelect={disableSelect} from />
            <span
                className='ts-lselect-swrap'
                onClick={() => {
                    if (from !== to && !disableSelect) {
                        dispatch(translationSwapFromAndTo());
                        selectionChange(to, from);
                    }
                }}
            >
                <IconFont iconName='#icon-MdSwap' />
            </span>
            <LSelect onChange={selectionChange} disableSelect={disableSelect} />
        </div>
    );
};

export default LanguageSelection;