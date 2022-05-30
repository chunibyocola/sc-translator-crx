import React, { useId, useRef } from 'react';
import { useRippleActivationClassName } from '../../public/react-use';
import { classNames } from '../../public/utils';
import './style.css';

type RadioProps = {
    value: string;
    name: string;
    label?: string | number | React.ReactElement;
    checked?: boolean;
    onChange?: (value: string) => void;
} & Pick<React.HtmlHTMLAttributes<HTMLInputElement>, 'className'>;

const Radio: React.FC<RadioProps> = ({ value, name, label, checked, onChange }) => {
    const [activationClassName, onActivate] = useRippleActivationClassName('radio--activation', 'radio--deactivation');

    const radioRootRef = useRef<HTMLSpanElement>(null);

    const id = useId();

    return (
        <label htmlFor={id} className='radio'>
            <span
                ref={radioRootRef}
                className={classNames('radio-root', activationClassName, checked && 'radio--checked')}
                onMouseDown={() => {
                    onActivate();
                }}
            >
                <input id={id} name={name} value={value} className='radio-input' onChange={e => onChange?.(e.target.value)} type='radio' checked={checked} />
                <div className='radio-thumb'></div>
                <div className='ripple'></div>
            </span>
            {label && <span>{label}</span>}
        </label>
    );
};

export default Radio;