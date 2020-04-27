import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {
    showTsResultWithOutResultObject,
    hideTsResult
} from '../../redux/actions/tsResultActions';
import getSelection from '../../public/utils/getSelection';
import {useOptions, useOnExtensionMessage, useIsEnable} from '../../public/react-use';
import {SCTS_CONTEXT_MENUS_CLICKED} from '../../constants/chromeSendMessageTypes';
import IconFont from '../IconFont';
import './style.css';

let timeout = null;
const debounce = (cb, time) => {
    return () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(cb, time);
    };
};

const TsBtn = () => {
    const [showBtn, setShowBtn] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const [text, setText] = useState('text');

    const posRef = useRef({x: 0, y: 0});
    const btnEle = useRef(null);

    const {translateDirectly} = useOptions(['translateDirectly']);
    const isEnableTranslate = useIsEnable('translate', window.location.host);
    const chromeMsg = useOnExtensionMessage();

    const dispatch = useDispatch();

    const handleSetPos = useCallback(
        ({x, y}) => {
            x += 5;
            y += 5;

            const dH = document.documentElement.clientHeight;
            const dW = document.documentElement.clientWidth;
            const bW = btnEle.current.clientWidth;
            const bH = btnEle.current.clientHeight;
            const bL = x;
            const bT = y;
            const bB = bT + bH;
            const bR = bL + bW;

            if (bB > dH) y = y - 10 - bH;
            if (bR > dW) x = x - 10 - bW;

            posRef.current = {x, y};
            setPos({x, y});
        },
        []
    );

    const selectCb = useCallback(
        (selectObj) => {
            if (!isEnableTranslate) return;

            if (translateDirectly) {
                // double click will call two times
                // use debounce to avoid it
                debounce(
                    () => {
                        dispatch(showTsResultWithOutResultObject(
                            selectObj.text,
                            {
                                x: selectObj.pos.x += 5,
                                y: selectObj.pos.y += 5
                            }
                        ));
                    },
                    500
                )();
                return;
            }

            setText(selectObj.text);
            setShowBtn(true);
            handleSetPos(selectObj.pos);

            dispatch(hideTsResult());
        },
        [dispatch, handleSetPos, translateDirectly, isEnableTranslate]
    );

    const unselectCb = useCallback(
        () => {
            setShowBtn(false);
            
            dispatch(hideTsResult());
        },
        [dispatch]
    );

    useEffect(
        () => {
            if (chromeMsg?.type === SCTS_CONTEXT_MENUS_CLICKED) {
                setShowBtn(false);

                dispatch(showTsResultWithOutResultObject(
                    chromeMsg.payload.selectionText,
                    posRef.current
                ));
            }
        },
        [chromeMsg, dispatch]
    );

    useEffect(
        () => {
            getSelection(selectCb, unselectCb);
        },
        [selectCb, unselectCb]
    );

    return (
        <div
            ref={btnEle}
            className='ts-btn'
            style={{
                display: isEnableTranslate && showBtn? 'block': 'none',
                transform: `translate(${pos.x}px, ${pos.y}px)`
            }}
            onMouseUp={(e) => {
                setShowBtn(false);
                dispatch(showTsResultWithOutResultObject(text, pos));
                e.stopPropagation();
            }}
            onMouseDown={e => e.stopPropagation()}
        >
            <IconFont iconName='#icon-MdTranslate' style={{display: 'block'}} />
        </div>
    );
};

export default TsBtn;