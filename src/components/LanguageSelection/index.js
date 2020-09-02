import React from 'react';
import LSelect from './LSelect';
import IconFont from '../IconFont';
import './style.css';

const LanguageSelection = ({ selectionChange, disableSelect, from, to, options }) => {
    return (
        <div className='ts-language-selection'>
            <LSelect onChange={selectionChange} disableSelect={disableSelect} from={from} to={to} options={options} isFrom />
            <span
                className='ts-lselect-swrap'
                onClick={() => {
                    if (from !== to && !disableSelect) {
                        selectionChange(to, from);
                    }
                }}
            >
                <IconFont iconName='#icon-MdSwap' />
            </span>
            <LSelect onChange={selectionChange} disableSelect={disableSelect} from={from} to={to} options={options} />
        </div>
    );
};

export default LanguageSelection;