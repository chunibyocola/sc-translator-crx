import React from 'react';
import { getI18nMessage } from '../../../public/chrome-call';

const OptionToggle = ({ id, message, checked, onClick }) => {
    return (
        <div className='option-toggle'>
            <input
                id={id}
                type='checkbox'
                checked={checked}
                onClick={onClick}
            />
            <label htmlFor={id}>
                {getI18nMessage(message)}
            </label>
        </div>
    );
};

export default OptionToggle;