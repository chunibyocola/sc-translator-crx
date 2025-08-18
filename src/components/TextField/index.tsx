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
    multiline?: boolean;
    rows?: number;
    required?: boolean;
};

const TextField: React.FC<TextFieldProps> = ({ label, onChange, defaultValue, error, helperText, placeholder, value, type, multiline, rows, required }) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '');

    useLayoutEffect(() => {
        value !== undefined && setInternalValue(value);
    }, [value]);

    const id = useId();

    return (
        <div className={cn('text-field', error && 'text-field--error')}>
            {label && <label className={cn('text-field__label', internalValue && 'value-not-empty')} htmlFor={id}>
                {label}
                {required && ' *'}
            </label>}
            <div className='text-field__input-area'>
                {!multiline && <input
                    placeholder={placeholder}
                    className={label && 'labeled-input'}
                    value={internalValue}
                    id={id}
                    type={type ?? 'text'}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e.target.value);
                    }}
                />}
                {multiline && <textarea
                    placeholder={placeholder}
                    className={label && 'labeled-input'}
                    value={internalValue}
                    id={id}
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e.target.value);
                    }}
                    rows={rows}
                />}
            </div>
            {helperText && <p className='text-field__helper-text'>{helperText}</p>}
        </div>
    );
};

export default TextField;