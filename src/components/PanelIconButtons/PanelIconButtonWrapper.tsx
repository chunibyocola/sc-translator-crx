import React, { useRef, useState } from 'react';
import './style.css';

type PanelIconButtonWrapperProps = {
    disabled?: boolean;
    iconGrey?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLSpanElement>, 'onClick' | 'children' | 'title'>

const PanelIconButtonWrapper: React.FC<PanelIconButtonWrapperProps> = ({ onClick, disabled, children, title, iconGrey }) => {
    const [activateClassName, setActivateClassName] = useState('');

    const clearClassTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    return (
        <span
            className={`panel-icon-btn${activateClassName}${disabled ? ' panel-icon-btn--disabled' : ''}${iconGrey ? ' panel-icon-btn--icon-grey' : ''}`}
            onMouseDown={() => {
                if (disabled) { return; }

                clearClassTimeoutRef.current && clearTimeout(clearClassTimeoutRef.current);

                setActivateClassName(' panel-icon-btn--activation');

                const removeActivation = () => {
                    setActivateClassName(' panel-icon-btn--deactivation');

                    clearClassTimeoutRef.current = setTimeout(() => setActivateClassName(''), 200);

                    window.removeEventListener('mouseup', removeActivation, true);
                }

                window.addEventListener('mouseup', removeActivation, true);
            }}
            onClick={(e) => !disabled && onClick?.(e)}
            title={title}
        >
            {children}
            <div className='ripple'></div>
        </span>
    );
};

export default PanelIconButtonWrapper;