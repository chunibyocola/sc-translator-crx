import React, { useId, useLayoutEffect, useState } from 'react';
import './style.css';
import { cn } from '../../public/utils';

type TextFieldProps = {
    label?: string;
    onChange?: (value: string) => void;
    defaultValue?: string;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    value?: string;
    type?: 'text' | 'search'
};

const TextField: React.FC<TextFieldProps> = ({ label, onChange, defaultValue, error, helperText, placeholder, value, type }) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '');

    useLayoutEffect(() => {
        value !== undefined && setInternalValue(value);
    }, [value]);

    const id = useId();

    return (
        <div className={cn('text-field', error && 'text-field--error')}>
            {label && <label className={cn('text-field__label', internalValue && 'value-not-empty')} htmlFor={id}>
                {label}
            </label>}
            <div className='text-field__input-area'>
                <input
                    placeholder={placeholder}
                    className={label && 'labeled-input'}
                    value={internalValue}
                    id={id}
                    type={type ?? 'text'}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e.target.value);
                    }}
                />
            </div>
            {helperText && <p className='text-field__helper-text'>{helperText}</p>}
        </div>
    );
};

export default TextField;