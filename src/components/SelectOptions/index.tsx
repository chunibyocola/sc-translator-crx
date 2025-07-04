import React, { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useWindowSize } from '../../public/react-use';
import { cn } from '../../public/utils';
import './style.css';

const calculateSelectOptionsStyle = (relativeElement: HTMLElement | null | undefined, optionsMaxHeight: number, optionsMaxWidth: number, fixed: boolean, cover?: boolean) => {
    if (!relativeElement) { return {}; }

    const {
        top: relativeTop,
        height: relativeHeight,
        left: relativeLeft,
        right: relativeRight,
        width: relativeWidth,
        bottom: relativeBottom
    } = relativeElement.getBoundingClientRect();
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

    if (fixed) {
        nextStyle.left = undefined;
        nextStyle.maxHeight = optionsMaxHeight;

        if (relativeBottom + optionsMaxHeight + 5 <= documentHeight) {
            nextStyle.top = relativeBottom;
        }
        else if (relativeTop - 5 >= optionsMaxHeight) {
            nextStyle.bottom = documentHeight - relativeTop;
        }
        else if (documentHeight - relativeBottom >= relativeTop) {
            nextStyle.top = relativeBottom;
            nextStyle.maxHeight = documentHeight - relativeBottom - 5;
        }
        else {
            nextStyle.bottom = documentHeight - relativeTop;
            nextStyle.maxHeight = relativeTop - 5;
        }

        if (relativeLeft + optionsMaxWidth + 5 <= documentWidth) {
            nextStyle.left = relativeLeft;
        }
        else if (optionsMaxWidth + 10 <= documentWidth) {
            nextStyle.left = documentWidth - 5 - optionsMaxWidth;
        }
        else {
            optionsMaxWidth = documentWidth - 10;
            nextStyle.left = 5;
        }

        nextStyle.maxWidth = optionsMaxWidth;
        nextStyle.width = optionsMaxWidth;

        return nextStyle;
    }

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
    fixed?: boolean;
    cover?: boolean;
    onShow?: () => void;
    ref?: React.Ref<SelectOptionsForwardRef>;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'children' | 'style' | 'className' | 'onMouseLeave' | 'onMouseDown' | 'onClick'>;

export type SelectOptionsForwardRef = {
    scrollToTop: () => void;
};

const SelectOptions: React.FC<SelectOptionsProps> = ({
    children,
    maxHeight = 300,
    maxWidth = 200,
    show,
    fixed,
    cover,
    style,
    className,
    onShow,
    onMouseLeave,
    onMouseDown,
    onClick,
    ref
}) => {
    const [optionsStyle, setOptionsStyle] = useState({});

    const windowSize = useWindowSize();

    const optionsElementRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        scrollToTop: () => optionsElementRef.current?.scrollTo({ top: 0 })
    }));

    useLayoutEffect(() => {
        show && setOptionsStyle(calculateSelectOptionsStyle(optionsElementRef.current?.parentElement, maxHeight, maxWidth, !!fixed, cover));
    }, [show, maxHeight, maxWidth, windowSize, cover, fixed]);

    useLayoutEffect(() => {
        show && onShow?.();
    }, [show, onShow]);

    return (
        <div
            className={cn('select-options', className)}
            ref={optionsElementRef}
            style={Object.assign({ display: show ? 'block' : 'none' }, { position: fixed ? 'fixed' : 'absolute' }, optionsStyle, style)}
            onMouseLeave={onMouseLeave}
            onMouseDown={onMouseDown}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default SelectOptions;