import React, { useCallback, useState, useEffect } from 'react';
import IconFont from '../../IconFont';
import { mtAddSource } from '../../../redux/actions/multipleTranslateActions';
import { useDispatch } from 'react-redux';
import { translateSource } from '../../../constants/translateSource';
import SourceFavicon from '../../SourceFavicon';
import './style.css';

const SourceSelector = ({ show, hideCallback, translations }) => {
    const [sourceList, setSourceList] = useState([]);

    const dispatch = useDispatch();

    const handleAddSourceUnshift = useCallback((source) => {
        dispatch(mtAddSource({ source, addType: 1 }));
        hideCallback();
    }, [dispatch, hideCallback]);

    const handleAddSourcePush = useCallback((source) => {
        dispatch(mtAddSource({ source, addType: 0 }));
        hideCallback();
    }, [dispatch, hideCallback]);

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