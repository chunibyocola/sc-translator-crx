import React from 'react';
import { getMessage } from '../../../public/i18n';

const OptionToggle = ({ id, message, checked, onClick }) => {
    return (
        <div className='option-toggle'>
            <input
                id={id}
                type='checkbox'
                checked={checked}
                onClick={onClick}
            />
            <label htmlFor={id} className='ts-button'>
                {getMessage(message)}
            </label>
        </div>
    );
};

export default OptionToggle;