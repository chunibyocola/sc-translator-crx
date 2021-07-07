import React, { useLayoutEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../public/react-use';
import './style.css';

const calculateTranslateTop = (optionsElement: HTMLDivElement, optionsMaxHeight: number, optionsMaxWidth: number) => {
    if (!optionsElement || !optionsElement.parentElement) { return {}; }

    const relativeElement = optionsElement.parentElement;

    const { top: relativeTop, height: relativeHeight, right: relativeRight, width: relativeWidth } = relativeElement.getBoundingClientRect();
    const documentWidth = document.documentElement.clientWidth, documentHeight = document.documentElement.clientHeight
    const maxWidth = documentWidth - 10;

    const bottomGap = documentHeight - relativeTop - relativeHeight - 5;
    const topGap = relativeTop - 5;
    const rightGap = documentWidth - relativeRight - 5;
    const widthGap = optionsMaxWidth - relativeWidth;

    let maxHeight;
    let top;
    let bottom;
    let left: undefined | number = 0;
    let right;
    let width = optionsMaxWidth;

    if (bottomGap >= optionsMaxHeight) {
        maxHeight = Math.min(optionsMaxHeight, bottomGap);
        top = relativeHeight;
    }
    else if (topGap >= optionsMaxHeight) {
        maxHeight = Math.min(optionsMaxHeight, topGap);
        bottom = relativeHeight;
    }
    else if (bottomGap >= topGap) {
        maxHeight = bottomGap;
        top = relativeHeight;
    }
    else {
        maxHeight = topGap;
        bottom = relativeHeight;
    }

    if (optionsMaxWidth + 10 > documentWidth) {
        left = undefined;
        right = -rightGap;
    }
    else if (widthGap > rightGap) {
        right = -rightGap;
        left = undefined;
    }

    return { maxHeight, maxWidth, top, bottom, left, right, width };
};

type SelectOptionsProps = {
    maxHeight?: number;
    maxWidth?: number;
    show: boolean;
    onShow?: () => void;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'children' | 'style' | 'className' | 'onMouseLeave' | 'onMouseDown' | 'onClick'>;

const SelectOptions: React.FC<SelectOptionsProps> = ({
    children,
    maxHeight = 300,
    maxWidth = 200,
    show,
    style,
    className,
    onShow,
    onMouseLeave,
    onMouseDown,
    onClick
}) => {
    const [optionsStyle, setOptionsStyle] = useState({});
    const [showOptions, setShowOptions] = useState(false);

    const windowSize = useWindowSize();

    const optionsElementRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!optionsElementRef.current) { return; }

        show && setOptionsStyle(calculateTranslateTop(
            optionsElementRef.current,
            maxHeight,
            maxWidth
        ));
        setShowOptions(show);
    }, [show, maxHeight, maxWidth, windowSize]);

    useLayoutEffect(() => {
        showOptions && onShow && onShow();
    }, [showOptions, onShow]);

    return (
        <div
            className={`ts-select-options${className ? ' ' + className : ''}`}
            ref={optionsElementRef}
            style={Object.assign({ display: showOptions ? 'block' : 'none' }, optionsStyle, style)}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default SelectOptions;