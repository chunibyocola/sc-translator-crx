import React, { useCallback, useState, useEffect } from 'react';
import IconFont from '../../IconFont';
import { TranslateSource, translateSource } from '../../../constants/translateSource';
import SourceFavicon from '../../SourceFavicon';
import './style.css';
import { Translation } from '../../../redux/slice/multipleTranslateSlice';

type SourceSelectorProps = {
    show: boolean;
    hideCallback: () => void;
    translations: Translation[];
    addSource: (source: string, addType: number) => void;
};

const SourceSelector: React.FC<SourceSelectorProps> = ({ show, hideCallback, translations, addSource }) => {
    const [sourceList, setSourceList] = useState<TranslateSource[]>([]);

    const handleAddSourceUnshift = useCallback((source: string) => {
        addSource(source, 1);
        hideCallback();
    }, [addSource, hideCallback]);

    const handleAddSourcePush = useCallback((source: string) => {
        addSource(source, 0);
        hideCallback();
    }, [addSource, hideCallback]);

    useEffect(() => {
        setSourceList(translateSource.filter(v => translations.findIndex(v1 => v1.source === v.source) < 0));
    }, [translations]);

    return (
        <div
            className='ts-mt-source-selector ts-scrollbar'
            style={{display: show ? 'block': 'none'}}
            onMouseLeave={hideCallback}
        >
            {sourceList.map(v => (<div
                className='ts-mt-source-selector-item ts-button'
                onClick={() => handleAddSourcePush(v.source)}
            >
                <span className='ts-mt-source-selector-item-source'>
                    <SourceFavicon source={v.source} />
                </span>
                <span className='ts-mt-source-selector-item-icons'>
                    <IconFont
                        iconName='#icon-top'
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddSourceUnshift(v.source);
                        }}
                    />
                </span>
            </div>))}
            {sourceList.length === 0 && <div style={{padding: '6px', textAlign: 'center'}}>......</div>}
        </div>
    );
};

export default SourceSelector;