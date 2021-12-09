import React, { useEffect, useRef, useState } from 'react';
import './style.css';

type ButtonProps = {
    variant: 'contained' | 'text' | 'outlined';
    disabled?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>

const Button: React.FC<ButtonProps> = ({ variant, onClick, children, disabled }) => {
    const [actived, setActived] = useState(false);

    const buttonEleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!actived) { return; }

        const onMouseUp = () => {
            setActived(false);
        };

        window.addEventListener('mouseup', onMouseUp);

        return () => window.removeEventListener('mouseup', onMouseUp);
    }, [actived]);

    return (
        <button
            ref={buttonEleRef}
            className={`btn btn--${variant}${actived ? ' btn--activation' : ''}`}
            onClick={onClick}
            onMouseDown={(e) => {
                const target = e.nativeEvent.target as HTMLButtonElement;

                const offsetX = e.nativeEvent.offsetX;
                const offsetY = e.nativeEvent.offsetY;
                const clientWidth = target.clientWidth;
                const size = Math.floor(clientWidth / 10 * 6);
                const start = { x: Math.floor(clientWidth * -0.3) + 1 + offsetX, y: Math.floor(clientWidth / -3.3) + offsetY };
                const end = { x: Math.floor((clientWidth - 64) / 5 + 13), y: -Math.floor((clientWidth - 64) * 0.3) - 1 };

                target.setAttribute('style', `--ripple-size:${size}px;--ripple-translate-start:${start.x}px,${start.y}px;--ripple-translate-end:${end.x}px,${end.y}px;`);

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