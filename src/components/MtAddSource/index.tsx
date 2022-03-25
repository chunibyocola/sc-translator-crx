import React, { useState, useCallback } from 'react';
import { Translation } from '../../redux/slice/multipleTranslateSlice';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from '../PanelIconButtons/PanelIconButtonWrapper';
import SourceSelector from './SourceSelector';
import './style.css';

type MtAddSourceProps = {
    translations: Translation[];
    addSource: (source: string, addType: number) => void;
};

const MtAddSource: React.FC<MtAddSourceProps> = ({ translations, addSource }) => {
    const [showSourceSelector, setShowSourceSelector] = useState(false);

    const plusOnClick = useCallback(() => {
        setShowSourceSelector(!showSourceSelector);
    }, [showSourceSelector]);

    const hideCallback = useCallback(() => {
        setShowSourceSelector(false);
    }, []);

    return (
        <div className='add-source'>
            <PanelIconButtonWrapper
                onClick={plusOnClick}
            >
                <IconFont
                    iconName='#icon-plus'
                    className='add-source__badge'
                />
            </PanelIconButtonWrapper>
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