import React, { useState, useCallback } from 'react';
import IconFont from '../IconFont';
import SourceSelector from './SourceSelector';
import './style.css';

const MtAddSource = ({ translations, addSource }) => {
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
                className='ts-mt-add-source-bage ts-button'
            />
            <SourceSelector
                show={showSourceSelector}
                hideCallback={hideCallback}
                translations={translations}
                addSource={addSource}
            />
        </div>
    );
};

export default MtAddSource;