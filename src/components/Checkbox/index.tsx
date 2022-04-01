import React, { useEffect, useId, useRef, useState } from 'react';
import './style.css';

type ChcekboxProps = {
    label?: string | number | React.ReactElement;
    checked?: boolean;
    indeterminate?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLInputElement>, 'className'>;

const Checkbox: React.FC<ChcekboxProps> = ({ label, checked, indeterminate, onChange, disabled }) => {
    const [activing, setActiving] = useState(false);

    const activedRef = useRef(false);
    const checkboxRootRef = useRef<HTMLSpanElement>(null);

    const id = useId();

    useEffect(() => {
        if (!activing) { return; }

        const onMouseUp = () => {
            setActiving(false);
        };

        window.addEventListener('mouseup', onMouseUp);

        return () => window.removeEventListener('mouseup', onMouseUp);
    }, [activing]);

    return (
        <label htmlFor={id} className={`checkbox${disabled ? ' checkbox--disabled' : ''}`}>
            <span
                ref={checkboxRootRef}
                className={`checkbox-root${activedRef.current ? activing ? ' checkbox--activation' : ' checkbox--deactivation' : ''}${checked ? ' checkbox--checked' : ''}`}
                onMouseDown={() => {
                    if (!checkboxRootRef.current || disabled) { return; }

                    const target = checkboxRootRef.current;

                    const { clientWidth, clientHeight } = target;

                    const size = Math.floor(clientWidth * 0.6);
                    const start = { x: clientWidth * 0.2, y: clientHeight * 0.2 };
                    const end = { x: clientWidth * 0.2, y: clientHeight * 0.2 };

                    target.setAttribute('style', `--ripple-size:${size}px;--ripple-translate-start:${start.x}px,${start.y}px;--ripple-translate-end:${end.x}px,${end.y}px;`);

                    activedRef.current = true;
                    setActiving(true);
                }}
            >
                <input id={id} className='checkbox-input' onChange={e => onChange?.(e.target.checked)} type='checkbox' checked={checked} disabled={disabled} />
                <svg className='iconfont' viewBox='0 0 24 24'>
                    <path
                        d={checked
                            ? 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
                            : indeterminate
                                ? 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z'
                                : 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'
                        }
                    />
                </svg>
                <div className='ripple'></div>
            </span>
            {label && <span className='checkbox__label'>{label}</span>}
        </label>
    );
};

export default Checkbox;