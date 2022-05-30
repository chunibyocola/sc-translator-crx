import React from 'react';
import { classNames } from '../../public/utils';
import logo from './logo.png';
import './style.css';

type LogoProps = Pick<React.HtmlHTMLAttributes<HTMLImageElement>, 'className' | 'style'>

const Logo: React.FC<LogoProps> = ({ style, className }) => {
    return (
        <img
            src={logo}
            className={classNames('logo', className)}
            style={style}
            alt='ScTranslator Logo'
        />
    );
};

export default Logo;