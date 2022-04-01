import React, { useEffect, useId, useRef, useState } from 'react';
import './style.css';

type SwitchProps = {
    label?: string | number | React.ReactElement;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
} & Pick<React.HtmlHTMLAttributes<HTMLInputElement>, 'className'>;

const Switch: React.FC<SwitchProps> = ({ label, onChange, checked }) => {
    const [activing, setActiving] = useState(false);

    const activedRef = useRef(false);
    const switchBaseRef = useRef<HTMLSpanElement>(null);

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
        <label htmlFor={id} className='switch'>
            <span
                className={`switch-root${activedRef.current ? activing ? ' switch--activation' : ' switch--deactivation' : ''}${checked ? ' switch--checked' : ''}`}
                onMouseDown={() => {
                    if (!switchBaseRef.current) { return; }

                    const target = switchBaseRef.current;

                    const { clientWidth, clientHeight } = target;

                    const size = Math.floor(clientWidth * 0.6);
                    const start = { x: clientWidth * 0.2, y: clientHeight * 0.2 };
                    const end = { x: clientWidth * 0.2, y: clientHeight * 0.2 };

                    target.setAttribute('style', `--ripple-size:${size}px;--ripple-translate-start:${start.x}px,${start.y}px;--ripple-translate-end:${end.x}px,${end.y}px;`);

                    activedRef.current = true;
                    setActiving(true);
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