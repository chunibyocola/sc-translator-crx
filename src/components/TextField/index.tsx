import React, { useId, useLayoutEffect, useState } from 'react';
import './style.css';
import { classNames } from '../../public/utils';
import Button from '../Button';
import IconFont from '../IconFont';

type TextFieldProps = {
    label?: string;
    onChange?: (value: string) => void;
    defaultValue?: string;
    error?: boolean;
    helperText?: string;
    placeholder?: string;
    value?: string;
    clearButton?: boolean;
};

const TextField: React.FC<TextFieldProps> = ({ label, onChange, defaultValue, error, helperText, placeholder, value, clearButton }) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue ?? '');

    useLayoutEffect(() => {
        value !== undefined && setInternalValue(value);
    }, [value]);

    const id = useId();

    return (
        <div className={classNames('text-field', error && 'text-field--error')}>
            {label && <label className={classNames('text-field__label', internalValue && 'value-not-empty')} htmlFor={id}>
                {label}
            </label>}
            <div className='text-field__input-area'>
                <input
                    placeholder={placeholder}
                    value={internalValue}
                    id={id}
                    type='text'
                    onChange={(e) => {
                        setInternalValue(e.target.value);
                        onChange?.(e.target.value);
                    }}
                />
                {clearButton && internalValue && <Button
                    variant='icon'
                    onClick={() => {
                        setInternalValue('');
                        onChange?.('');
                    }}
                >
                    <IconFont iconName='#icon-GoX' />
                </Button>}
            </div>
            {helperText && <p className='text-field__helper-text'>{helperText}</p>}
        </div>
    );
};

export default TextField;