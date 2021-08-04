import React, { useCallback } from 'react';
import { getMessage } from '../../../public/i18n';
import './style.css';

type DefaultSelectProps = {
    message: string;
    onChange: (value: string) => void;
    value: string;
    options: { [key: string]: string }[];
    optionValue: string;
    optionLabel: string;
};

const DefaultSelect: React.FC<DefaultSelectProps> = ({ message, onChange, value, options, optionValue, optionLabel }) => {
    const handleOnChange = useCallback(e => {
        const ele =  e.target;
        const curValue = ele.options[ele.selectedIndex].value;

        onChange(curValue);
    }, [onChange]);
    
    return (
        <div className='default-select'>
            {getMessage(message)}
            <select
                className='default-select__select'
                value={value}
                onChange={handleOnChange}
            >
                {options.map(v => (
                    <option
                        value={v[optionValue]}
                        key={v[optionValue]}
                    >
                        {v[optionLabel]}
                    </option>
                ))}
            </select>
        </div>
    )
};

export default DefaultSelect;