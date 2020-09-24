import React, { useCallback, useState, useRef, useLayoutEffect } from 'react';
import IconFont from '../IconFont';
import SourceFavicon from '../SourceFavicon';
import './style.css';

const optionsMaxHeight = 300;

const SourceSelect = ({ onChange, sourceList, source, className, disabled }) => {
    const [optionsStyle, setOptionsStyle] = useState({});
    const [showOptions, setShowOptions] = useState(false);

    const sourceSelectElementRef = useRef(null);
    const optionsElementRef = useRef(null);

    const optionClick = useCallback((value) => {
        if (value === source) { return; }

        onChange(value);

        setShowOptions(false);
    }, [source, onChange]);

    const calculateTranslateTop = useCallback(() => {
        if (!sourceSelectElementRef.current || !optionsElementRef.current) { return {}; }

        const documentHeight = document.documentElement.clientHeight;
        const { top, height } = sourceSelectElementRef.current.getBoundingClientRect();
        const { height: optionsHeight } = optionsElementRef.current.getBoundingClientRect();

        const bottomGap = documentHeight - top - height - 5;
        const topGap = top - 5;

        let maxHeight;
        let nextTop;

        if (bottomGap >= optionsHeight) {
            maxHeight = bottomGap > optionsMaxHeight ? optionsMaxHeight : bottomGap;
            nextTop = height;
        }
        else if (topGap >= optionsHeight) {
            maxHeight = topGap > optionsMaxHeight ? optionsMaxHeight : topGap;
            nextTop = -optionsHeight;
        }
        else if (bottomGap >= topGap) {
            maxHeight = bottomGap;
            nextTop = height;
        }
        else {
            maxHeight = topGap;
            nextTop = -topGap;
        }
        return { maxHeight, top: nextTop };
    }, []);

    useLayoutEffect(() => {
        showOptions && setOptionsStyle(calculateTranslateTop());
    }, [showOptions, calculateTranslateTop]);

    return (
        <div
            tabIndex="0"
            ref={sourceSelectElementRef}
            className={`ts-source-select${className ? ' ' + className : ''}${disabled ? ' ts-source-select-disabled' : ''}`}
            onClick={() => !disabled && setShowOptions(!showOptions)}
            onMouseLeave={() => !disabled && setShowOptions(false)}
            onMouseDown={e => disabled && e.preventDefault()}
        >
            <span className='ts-source-select-value'>
                <SourceFavicon source={source} />
            </span>
            <IconFont iconName='#icon-GoChevronDown' style={{position: 'absolute', right: '2px'}} />
            <div
                ref={optionsElementRef}
                className='ts-source-select-options ts-scrollbar'
                style={{display: showOptions ? 'block' : 'none', ...optionsStyle}}
            >
                {sourceList.map((v) => (<div
                    className='ts-source-select-option'
                    key={v.source}
                    onClick={() => optionClick(v.source)}
                >
                    <SourceFavicon source={v.source} />
                </div>))}
            </div>
        </div>
    );
};

export default SourceSelect;