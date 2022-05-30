import React from 'react';
import { useRippleActivationClassName } from '../../public/react-use';
import { classNames } from '../../public/utils';
import './style.css';

type ButtonProps = {
    variant: 'contained' | 'text' | 'outlined' | 'icon';
    disabled?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children' | 'className'>;

const Button: React.FC<ButtonProps> = ({ variant, onClick, children, disabled, className }) => {
    const [activationClassName, onActivate] = useRippleActivationClassName('btn--activation', 'btn--deactivation');

    return (
        <button
            className={classNames('btn', `btn--${variant}`, activationClassName, className)}
            onClick={onClick}
            onMouseDown={(e) => {
                if (variant !== 'icon') {
                    const target = e.nativeEvent.target as HTMLButtonElement;

                    const { offsetX, offsetY } = e.nativeEvent;
                    const { clientWidth, clientHeight } = target;

                    const size = clientWidth * 0.6;
                    const start = { x: offsetX - (size >> 1), y: offsetY - (size >> 1) };
                    const end = { x: clientWidth * 0.2, y: (clientHeight - size) >> 1 };

                    const styleValue = `--ripple-size:${size}px;`
                        + `--ripple-translate-start:${start.x}px,${start.y}px;`
                        + `--ripple-translate-end:${end.x}px,${end.y}px;`
                        + `--ripple-scale-start:0.5;`
                        + `--ripple-scale-end:1.8;`;
                    target.setAttribute('style', styleValue);
                }

                onActivate();
            }}
            disabled={disabled}
        >
            {children}
            <div className='ripple'></div>
        </button>
    );
};

export default Button;