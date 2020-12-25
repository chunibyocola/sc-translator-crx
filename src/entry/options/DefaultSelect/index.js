import React, { useCallback } from 'react';
import { getI18nMessage } from '../../../public/chrome-call';
import './style.css';

const DefaultSelect = ({ message, onChange, value, options, optionValue, optionLabel }) => {
    const handleOnChange = useCallback(e => {
        const ele =  e.target;
        const curValue = ele.options[ele.selectedIndex].value;

        onChange(curValue);
    }, [onChange]);
    
    return (
        <div className='default-select'>
            {getI18nMessage(message)}
            <select
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