import React from 'react';
import { useRippleActivationClassName } from '../../public/react-use';
import './style.css';

type PanelIconButtonWrapperProps = {
    disabled?: boolean;
    iconGrey?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLSpanElement>, 'onClick' | 'children' | 'title'>

const PanelIconButtonWrapper: React.FC<PanelIconButtonWrapperProps> = ({ onClick, disabled, children, title, iconGrey }) => {
    const [activationClassName, onActivate] = useRippleActivationClassName(' panel-icon-btn--activation', ' panel-icon-btn--deactivation');

    return (
        <span
            className={`panel-icon-btn${activationClassName}${disabled ? ' panel-icon-btn--disabled' : ''}${iconGrey ? ' panel-icon-btn--icon-grey' : ''}`}
            onMouseDown={(e) => {
                if (disabled) { return; }

                (e.nativeEvent.target as HTMLButtonElement).setAttribute('style', '--ripple-scale-start:0.5;--ripple-scale-end:1.8;');

                onActivate();
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