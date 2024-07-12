import React from 'react';
import { cn } from '../../public/utils';
import logo from './logo.png';
import './style.css';

type LogoProps = Pick<React.HtmlHTMLAttributes<HTMLImageElement>, 'className' | 'style'>

const Logo: React.FC<LogoProps> = ({ style, className }) => {
    return (
        <img
            src={logo}
            className={cn('logo', className)}
            style={style}
            alt='ScTranslator Logo'
        />
    );
};

export default Logo;