import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useDispatch} from 'react-redux';
import {
    requestTsResultWithOutResultObject,
} from '../../redux/actions/tsResultActions';
import {
    setResultBoxShowAndPosition,
    hideResultBox
} from '../../redux/actions/resultBoxActions';
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
    const ctrlPressing = useRef(false);

    const { translateDirectly, showButtonAfterSelect, translateWithKeyPress } = useOptions(['translateDirectly', 'showButtonAfterSelect', 'translateWithKeyPress']);
    const isEnableTranslate = useIsEnable('translate', window.location.host);
    const chromeMsg = useOnExtensionMessage();

    const dispatch = useDispatch();

    const handleForwardTranslate = useCallback(
        (text, pos) => {
            dispatch(setResultBoxShowAndPosition(pos));
            dispatch(requestTsResultWithOutResultObject(text));
        },
        [dispatch]
    );

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

            handleSetPos(pos);

            if ((translateWithKeyPress && ctrlPressing.current) || translateDirectly) {
                handleForwardTranslate(text, posRef.current);

                return;
            }

            setText(text);
            showButtonAfterSelect && setShowBtn(true);

            dispatch(hideResultBox());
        },
        [dispatch, handleSetPos, translateDirectly, isEnableTranslate, showButtonAfterSelect, translateWithKeyPress, handleForwardTranslate]
    );

    const unselectCb = useCallback(
        () => {
            setShowBtn(false);
            
            dispatch(hideResultBox());
        },
        [dispatch]
    );

    useEffect(
        () => {
            if (!translateWithKeyPress) return;

            const onKeyDown = (e) => {
                e.key === 'Control' && !ctrlPressing.current && (ctrlPressing.current = true);
            };
            const onKeyUp = (e) => {
                e.key === 'Control' && ctrlPressing.current && (ctrlPressing.current = false);
            };

            window.addEventListener('keydown', onKeyDown);
            window.addEventListener('keyup', onKeyUp);

            return () => {
                window.removeEventListener('keydown', onKeyDown);
                window.removeEventListener('keyup', onKeyUp);
            }
        },
        [translateWithKeyPress]
    );

    useEffect(
        () => {
            if (!isEnableTranslate) return;

            if (chromeMsg?.type === SCTS_CONTEXT_MENUS_CLICKED) {
                setShowBtn(false);

                handleForwardTranslate(
                    chromeMsg.payload.selectionText,
                    posRef.current
                );
            }
            else if (chromeMsg?.type === SCTS_TRANSLATE_COMMAND_KEY_PRESSED) {
                setShowBtn(false);

                const text = getSelectedText();
                text && handleForwardTranslate(text, posRef.current);
            }
            else if (chromeMsg?.type === SCTS_AUDIO_COMMAND_KEY_PRESSED) {
                const text = getSelectedText();
                text && sendAudio(text, {});
            }
        },
        [chromeMsg, isEnableTranslate, handleForwardTranslate]
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
                handleForwardTranslate(text, posRef.current);
                e.stopPropagation();
            }}
            onMouseDown={e => e.stopPropagation()}
        >
            <IconFont iconName='#icon-MdTranslate' style={{display: 'block'}} />
        </div>
    );
};

export default TsBtn;