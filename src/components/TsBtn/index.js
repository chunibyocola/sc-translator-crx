import React, {useState, useEffect, useCallback, useRef} from 'react';
import { useDispatch } from 'react-redux';
import {
    setResultBoxShowAndPosition,
    hideResultBox,
    callOutResultBox
} from '../../redux/actions/resultBoxActions';
import { mtSetText } from '../../redux/actions/multipleTranslateActions';
import getSelection, { getSelectedText } from '../../public/utils/get-selection';
import { useOptions, useOnExtensionMessage, useIsEnable } from '../../public/react-use';
import {
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';
import IconFont from '../IconFont';
import './style.css';
import { sendAudio } from '../../public/send';
import { stSetText } from '../../redux/actions/singleTranslateActions';
import { getOptions } from '../../public/options';
import { debounce } from '../../public/utils';

const initText = '';
const initPos = { x: 5, y: 5 };
const btnWidth = 24;
const btnHeight = 24;
const useOptionsDependency = ['translateDirectly', 'showButtonAfterSelect', 'translateWithKeyPress', 'hideButtonAfterFixedTime', 'hideButtonFixedTime'];

const calculateBtnPos = ({ x, y }) => {
    const { btnPosition } = getOptions();
    let tmpX = x + btnPosition.x, tmpY = y + btnPosition.y;

    const dH = document.documentElement.clientHeight;
    const dW = document.documentElement.clientWidth;
    const bL = tmpX;
    const bT = tmpY;
    const bB = bT + btnHeight;
    const bR = bL + btnWidth;

    if (bB > dH) tmpY = y - 5 - btnHeight;
    if (bT < 0) tmpY = y + 5;
    if (bR > dW) tmpX = x - 5 - btnWidth;
    if (bL < 0) tmpX = x + 5;

    return { x: tmpX, y: tmpY };
};

const TsBtn = ({ multipleTranslateMode }) => {
    const [showBtn, setShowBtn] = useState(false);
    const [pos, setPos] = useState(initPos);
    const [text, setText] = useState(initText);

    const posRef = useRef(initPos);
    const btnEle = useRef(null);
    const ctrlPressing = useRef(false);
    const debounceHideButtonAfterFixedTime = useRef(null);

    const { translateDirectly, showButtonAfterSelect, translateWithKeyPress , hideButtonAfterFixedTime, hideButtonFixedTime } = useOptions(useOptionsDependency);
    const isEnableTranslate = useIsEnable('translate', window.location.host);
    const chromeMsg = useOnExtensionMessage();

    const dispatch = useDispatch();

    const handleForwardTranslate = useCallback((text, pos) => {
        dispatch(setResultBoxShowAndPosition(pos));
        multipleTranslateMode ? dispatch(mtSetText({ text })) : dispatch(stSetText({ text }));
    }, [dispatch, multipleTranslateMode]);

    const handleSetPos = useCallback(({ x, y }) => {
        const result = calculateBtnPos({ x, y });

        posRef.current = result;
        setPos(result);
    }, []);

    const selectCb = useCallback(({ text, pos }) => {
        if (!isEnableTranslate) return;

        handleSetPos(pos);

        if ((translateWithKeyPress && ctrlPressing.current) || translateDirectly) {
            handleForwardTranslate(text, posRef.current);
            return;
        }

        setText(text);
        if (showButtonAfterSelect) {
            setShowBtn(true);
            hideButtonAfterFixedTime && debounceHideButtonAfterFixedTime.current();
        }

        dispatch(hideResultBox());
    }, [dispatch, handleSetPos, translateDirectly, isEnableTranslate, showButtonAfterSelect, translateWithKeyPress, handleForwardTranslate, hideButtonAfterFixedTime]);

    const unselectCb = useCallback(() => {
        setShowBtn(false);
        
        dispatch(hideResultBox());
    }, [dispatch]);

    useEffect(() => {
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
    }, [translateWithKeyPress]);

    useEffect(() => {
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
        else if (chromeMsg?.type === SCTS_CALL_OUT_COMMAND_KEY_PRESSED) {
            dispatch(callOutResultBox());
        }
    }, [chromeMsg, isEnableTranslate, handleForwardTranslate, dispatch]);

    useEffect(() => {
        const unsubscribe = getSelection(selectCb, unselectCb);

        return unsubscribe;
    }, [selectCb, unselectCb]);

    useEffect(() => {
        debounceHideButtonAfterFixedTime.current = debounce(() => setShowBtn(false), hideButtonFixedTime);
    }, [hideButtonFixedTime]);

    return (
        <div
            ref={btnEle}
            className='ts-btn'
            style={{
                display: isEnableTranslate && showBtn ? 'block' : 'none',
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