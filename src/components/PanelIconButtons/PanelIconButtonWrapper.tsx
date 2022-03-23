import React, { useRef, useState } from 'react';
import './style.css';

type PanelIconButtonWrapperProps = {
    disabled?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLSpanElement>, 'onClick' | 'children' | 'title'>

const PanelIconButtonWrapper: React.FC<PanelIconButtonWrapperProps> = ({ onClick, disabled, children, title }) => {
    const [activateClassName, setActivateClassName] = useState('');

    const clearClassTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

    return (
        <span
            className={`panel-icon-btn${activateClassName}${disabled ? ' panel-icon-btn--disabled' : ''}`}
            onMouseDown={() => {
                if (disabled) { return; }

                clearClassTimeoutRef.current && clearTimeout(clearClassTimeoutRef.current);
                
                setActivateClassName(' panel-icon-btn--activation');
            }}
            onMouseUp={() => {
                if (disabled) { return; }
                
                setActivateClassName(' panel-icon-btn--deactivation');

                clearClassTimeoutRef.current = setTimeout(() => setActivateClassName(''), 200);
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