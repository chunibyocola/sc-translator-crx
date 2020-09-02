import React, { useState, useCallback } from 'react';
import IconFont from '../../IconFont';
import SourceSelector from './SourceSelector';
import './style.css';

const MtAddSource = ({ translations }) => {
    const [showSourceSelector, setShowSourceSelector] = useState(false);

    const plusOnClick = useCallback(() => {
        setShowSourceSelector(!showSourceSelector);
    }, [showSourceSelector]);

    const hideCallback = useCallback(() => {
        setShowSourceSelector(false);
    }, []);

    return (
        <div className='ts-mt-add-source'>
            <IconFont
                iconName='#icon-plus'
                onClick={plusOnClick}
                className='ts-button'
            />
            <SourceSelector
                show={showSourceSelector}
                hideCallback={hideCallback}
                translations={translations}
            />
        </div>
    );
};

export default MtAddSource;