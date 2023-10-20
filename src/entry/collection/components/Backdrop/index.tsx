import React from 'react';
import './style.css';

type BackdropProps = Pick<React.HtmlHTMLAttributes<HTMLButtonElement>, 'children'>;

const Backdrop: React.FC<BackdropProps> = ({ children }) => {
    return (
        <div className='backdrop'>
            {children}
        </div>
    );
};

export default Backdrop;