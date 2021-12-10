import React, { useEffect, useRef, useState } from 'react';
import './style.css';

type ButtonProps = {
    variant: 'contained' | 'text' | 'outlined' | 'icon';
    disabled?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children' | 'className'>

const Button: React.FC<ButtonProps> = ({ variant, onClick, children, disabled, className }) => {
    const [activing, setActived] = useState(false);

    const buttonEleRef = useRef<HTMLButtonElement>(null);
    const activedRef = useRef(false);

    useEffect(() => {
        if (!activing) { return; }

        const onMouseUp = () => {
            setActived(false);
        };

        window.addEventListener('mouseup', onMouseUp);

        return () => window.removeEventListener('mouseup', onMouseUp);
    }, [activing]);

    return (
        <button
            ref={buttonEleRef}
            className={`btn btn--${variant}${activedRef.current ? activing ? ' btn--activation' : ' btn--deactivation' : ''}${className ? ' ' + className : ''}`}
            onClick={onClick}
            onMouseDown={(e) => {
                const target = e.nativeEvent.target as HTMLButtonElement;

                const { offsetX, offsetY } = e.nativeEvent;
                const { clientWidth, clientHeight } = target;

                let size = Math.floor(clientWidth * 0.6);
                let start = { x: Math.floor(clientWidth * -0.3) + 1 + offsetX, y: Math.floor(clientWidth / -3.3) + offsetY };
                let end = { x: Math.floor((clientWidth - 64) / 5 + 13), y: -Math.floor((clientWidth - 64) * 0.3) - 1 };

                if (variant === 'icon') {
                    start = { x: clientWidth * 0.2, y: clientHeight * 0.2 };
                    end = { x: clientWidth * 0.2, y: clientHeight * 0.2 };
                }

                target.setAttribute('style', `--ripple-size:${size}px;--ripple-translate-start:${start.x}px,${start.y}px;--ripple-translate-end:${end.x}px,${end.y}px;`);

                activedRef.current = true;
                setActived(true);
            }}
            disabled={disabled}
        >
            {children}
            <div className='btn__ripple'></div>
        </button>
    );
};

export default Button;