import React from 'react';
import { getI18nMessage } from '../../public/chrome-call';

const OptionToggle = ({ id, message, checked, onClick }) => {
    return (
        <>
            <input
                id={id}
                type='checkbox'
                checked={checked}
                onClick={onClick}
            />
            <label htmlFor={id}>
                {getI18nMessage(message)}
            </label>
        </>
    );
};

export default OptionToggle;