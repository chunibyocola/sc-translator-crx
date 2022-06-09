import React, { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../public/react-use';
import { classNames } from '../../public/utils';
import './style.css';

const calculateSelectOptionsStyle = (relativeElement: HTMLElement | null | undefined, optionsMaxHeight: number, optionsMaxWidth: number, cover?: boolean) => {
    if (!relativeElement) { return {}; }

    const { top: relativeTop, height: relativeHeight, right: relativeRight, width: relativeWidth, bottom: relativeBottom } = relativeElement.getBoundingClientRect();
    const documentWidth = document.documentElement.clientWidth, documentHeight = document.documentElement.clientHeight;

    const verticalRelativeDistance = cover ? 0 : relativeHeight;
    const bottomGap = documentHeight - relativeTop - 5 - verticalRelativeDistance;
    const topGap = relativeBottom - 5 - verticalRelativeDistance;

    const rightGap = documentWidth - relativeRight - 5;
    const widthGap = optionsMaxWidth - relativeWidth;

    const nextStyle: React.CSSProperties = {
        left: 0,
        maxHeight: undefined,
        top: undefined,
        bottom: undefined,
        right: undefined,
        maxWidth: Math.min(optionsMaxWidth, documentWidth - 10),
        width: optionsMaxWidth
    };

    if (bottomGap >= optionsMaxHeight) {
        nextStyle.maxHeight = Math.min(optionsMaxHeight, bottomGap);
        nextStyle.top = verticalRelativeDistance + Math.max(0, -(relativeTop + verticalRelativeDistance - 5));
    }
    else if (topGap >= optionsMaxHeight) {
        nextStyle.maxHeight = Math.min(optionsMaxHeight, topGap);
        nextStyle.bottom = verticalRelativeDistance + Math.max(0, -(documentHeight - relativeBottom + verticalRelativeDistance - 5));
    }
    else if (bottomGap >= topGap) {
        nextStyle.maxHeight = Math.min(bottomGap, documentHeight - 10);
        nextStyle.top = verticalRelativeDistance + Math.max(0, -(relativeTop + verticalRelativeDistance - 5));
    }
    else {
        nextStyle.maxHeight = Math.min(topGap, documentHeight - 10);
        nextStyle.bottom = verticalRelativeDistance + Math.max(0, -(documentHeight - relativeBottom + verticalRelativeDistance - 5));
    }

    if (optionsMaxWidth + 10 > documentWidth) {
        nextStyle.left = undefined;
        nextStyle.right = -rightGap;
    }
    else if (widthGap > rightGap) {
        nextStyle.right = -rightGap;
        nextStyle.left = undefined;
    }

    return nextStyle;
};

type SelectOptionsProps = {
    maxHeight?: number;
    maxWidth?: number;
    show: boolean;
    cover?: boolean;
    onShow?: () => void;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'children' | 'style' | 'className' | 'onMouseLeave' | 'onMouseDown' | 'onClick'>;

export type SelectOptionsForwardRef = {
    scrollToTop: () => void;
};

const SelectOptions = React.forwardRef<SelectOptionsForwardRef, SelectOptionsProps>(({
    children,
    maxHeight = 300,
    maxWidth = 200,
    show,
    cover,
    style,
    className,
    onShow,
    onMouseLeave,
    onMouseDown,
    onClick
}, forwardedRef) => {
    const [optionsStyle, setOptionsStyle] = useState({});

    const windowSize = useWindowSize();

    const optionsElementRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(forwardedRef, () => ({
        scrollToTop: () => optionsElementRef.current?.scrollTo({ top: 0 })
    }));

    useLayoutEffect(() => {
        show && setOptionsStyle(calculateSelectOptionsStyle(optionsElementRef.current?.parentElement, maxHeight, maxWidth, cover));
    }, [show, maxHeight, maxWidth, windowSize, cover]);

    useLayoutEffect(() => {
        show && onShow?.();
    }, [show, onShow]);

    return (
        <div
            className={classNames('select-options', className)}
            ref={optionsElementRef}
            style={Object.assign({ display: show ? 'block' : 'none' }, optionsStyle, style)}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            {children}
        </div>
    );
});

export default SelectOptions;