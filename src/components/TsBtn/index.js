import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {
    showTsResultWithOutResultObject,
    hideTsResult
} from '../../redux/actions/tsResultActions';
import getSelection, { getSelectedText } from '../../public/utils/get-selection';
import {useOptions, useOnExtensionMessage, useIsEnable} from '../../public/react-use';
import {
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';
import IconFont from '../IconFont';
import './style.css';
import { sendAudio } from '../../public/send';

const initText = '';
const initPos = { x: 5, y: 5 };

const TsBtn = () => {
    const [showBtn, setShowBtn] = useState(false);
    const [pos, setPos] = useState(initPos);
    const [text, setText] = useState(initText);

    const posRef = useRef(initPos);
    const btnEle = useRef(null);

    const { translateDirectly, showButtonAfterSelect } = useOptions(['translateDirectly', 'showButtonAfterSelect']);
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
        ({ text, pos }) => {
            if (!isEnableTranslate) return;

            if (translateDirectly) {
                dispatch(showTsResultWithOutResultObject(
                    text,
                    {　x: pos.x += 5,y: pos.y += 5　}
                ));

                return;
            }

            setText(text);
            handleSetPos(pos);
            showButtonAfterSelect && setShowBtn(true);

            dispatch(hideTsResult());
        },
        [dispatch, handleSetPos, translateDirectly, isEnableTranslate, showButtonAfterSelect]
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
            if (!isEnableTranslate) return;

            if (chromeMsg?.type === SCTS_CONTEXT_MENUS_CLICKED) {
                setShowBtn(false);

                dispatch(showTsResultWithOutResultObject(
                    chromeMsg.payload.selectionText,
                    posRef.current
                ));
            }
            else if (chromeMsg?.type === SCTS_TRANSLATE_COMMAND_KEY_PRESSED) {
                setShowBtn(false);

                const text = getSelectedText();
                text && dispatch(showTsResultWithOutResultObject(
                    text,
                    posRef.current
                ));
            }
            else if (chromeMsg?.type === SCTS_AUDIO_COMMAND_KEY_PRESSED) {
                const text = getSelectedText();
                text && sendAudio(text, {});
            }
        },
        [chromeMsg, isEnableTranslate, dispatch]
    );

    useEffect(
        () => {
            const unsubscribe = getSelection(selectCb, unselectCb);

            return unsubscribe;
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