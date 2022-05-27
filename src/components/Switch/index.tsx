import React, { useId, useRef } from 'react';
import { useRippleActivationClassName } from '../../public/react-use';
import './style.css';

type SwitchProps = {
    label?: string | number | React.ReactElement;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
} & Pick<React.HtmlHTMLAttributes<HTMLInputElement>, 'className'>;

const Switch: React.FC<SwitchProps> = ({ label, onChange, checked }) => {
    const [activationClassName, onActivate] = useRippleActivationClassName(' switch--activation', ' switch--deactivation');

    const switchBaseRef = useRef<HTMLSpanElement>(null);

    const id = useId();

    return (
        <label htmlFor={id} className='switch'>
            <span
                className={`switch-root${activationClassName}${checked ? ' switch--checked' : ''}`}
                onMouseDown={() => {
                    onActivate();
                }}
            >
                <span className='switch-base' ref={switchBaseRef}>
                    <input id={id} className='switch-input' onChange={e => onChange?.(e.target.checked)} type='checkbox' checked={checked} />
                    <div className='switch-thumb'></div>
                    <div className='ripple'></div>
                </span>
                <div className='switch-track'></div>
            </span>
            {label && <span>{label}</span>}
        </label>
    );
};

export default Switch;