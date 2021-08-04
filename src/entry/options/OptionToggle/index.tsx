import React from 'react';
import { getMessage } from '../../../public/i18n';

type OptionToggleProps = {
    id: string;
    message: string;
    checked: boolean;
    onClick: () => void;
};

const OptionToggle: React.FC<OptionToggleProps> = ({ id, message, checked, onClick }) => {
    return (
        <div className='option-toggle'>
            <input
                id={id}
                type='checkbox'
                checked={checked}
                onClick={onClick}
            />
            <label htmlFor={id} className='button'>
                {getMessage(message)}
            </label>
        </div>
    );
};

export default OptionToggle;