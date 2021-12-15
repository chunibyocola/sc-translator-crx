import React, { useEffect, useMemo, useRef, useState } from 'react';
import './style.css';

type RadioProps = {
    value: string;
    name: string;
    label?: string | number | React.ReactElement;
    checked?: boolean;
    onChange?: (value: string) => void;
} & Pick<React.HtmlHTMLAttributes<HTMLInputElement>, 'className'>;

// Will replace will React built-in "useId" while migrating to React-18.0.0 (stable).
const useId = () => {
    const id = useMemo(() => {
        return Math.random().toString().substring(2);
    }, []);

    return id;
};

const Radio: React.FC<RadioProps> = ({ value, name, label, checked, onChange }) => {
    const [activing, setActiving] = useState(false);

    const activedRef = useRef(false);
    const radioRootRef = useRef<HTMLSpanElement>(null);

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
        <label htmlFor={id} className='radio'>
            <span
                ref={radioRootRef}
                className={`radio-root${activedRef.current ? activing ? ' radio--activation' : ' radio--deactivation' : ''}${checked ? ' radio--checked' : ''}`}
                onMouseDown={() => {
                    if (!radioRootRef.current) { return; }

                    const target = radioRootRef.current;

                    const { clientWidth, clientHeight } = target;

                    const size = Math.floor(clientWidth * 0.6);
                    const start = { x: clientWidth * 0.2, y: clientHeight * 0.2 };
                    const end = { x: clientWidth * 0.2, y: clientHeight * 0.2 };

                    target.setAttribute('style', `--ripple-size:${size}px;--ripple-translate-start:${start.x}px,${start.y}px;--ripple-translate-end:${end.x}px,${end.y}px;`);

                    activedRef.current = true;
                    setActiving(true);
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