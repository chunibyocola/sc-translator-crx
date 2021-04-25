import React, {useState, useEffect, useCallback, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setResultBoxShowAndPosition,
    callOutResultBox,
    closeResultBox,
    requestToHidePanel
} from '../../redux/actions/resultBoxActions';
import { mtSetText } from '../../redux/actions/multipleTranslateActions';
import { getSelectedText } from '../../public/utils/get-selection';
import { useOptions, useOnExtensionMessage, useIsEnable, useGetSelection } from '../../public/react-use';
import {
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';
import IconFont from '../IconFont';
import './style.css';
import { sendAudio, sendSeparate } from '../../public/send';
import { stSetText } from '../../redux/actions/singleTranslateActions';
import { getOptions } from '../../public/options';
import { debounce, isTextBox } from '../../public/utils';

const initText = '';
const initPos = { x: 5, y: 5 };
const btnWidth = 24;
const btnHeight = 24;
const useOptionsDependency = [
    'translateDirectly',
    'showButtonAfterSelect',
    'translateWithKeyPress',
    'hideButtonAfterFixedTime',
    'hideButtonFixedTime',
    'respondToSeparateWindow',
    'translateDirectlyWhilePinning',
    'doNotRespondInTextBox'
];

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

    const ctrlPressing = useRef(false);
    const debounceHideButtonAfterFixedTime = useRef(null);
    const oldChromeMsg = useRef(null);

    const { pinning } = useSelector(state => state.resultBoxState);

    const {
        translateDirectly,
        showButtonAfterSelect,
        translateWithKeyPress,
        hideButtonAfterFixedTime,
        hideButtonFixedTime,
        respondToSeparateWindow,
        translateDirectlyWhilePinning,
        doNotRespondInTextBox
    } = useOptions(useOptionsDependency);

    const isEnableTranslate = useIsEnable('translate', window.location.host);

    const chromeMsg = useOnExtensionMessage();

    const dispatch = useDispatch();

    const handleForwardTranslate = useCallback((text, pos) => {
        if (respondToSeparateWindow) {
            sendSeparate(text);
            return;
        }

        dispatch(setResultBoxShowAndPosition(pos));
        multipleTranslateMode ? dispatch(mtSetText({ text })) : dispatch(stSetText({ text }));
    }, [dispatch, multipleTranslateMode, respondToSeparateWindow]);

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
        if (oldChromeMsg.current === chromeMsg || !isEnableTranslate) { return; }

        const { type, payload } = chromeMsg;
        let text;

        switch (type) {
            case SCTS_CONTEXT_MENUS_CLICKED:
                setShowBtn(false);
                handleForwardTranslate(payload.selectionText, pos);
                break;
            case SCTS_TRANSLATE_COMMAND_KEY_PRESSED:
                setShowBtn(false);
                text = getSelectedText();
                text && handleForwardTranslate(text, pos);
                break;
            case SCTS_AUDIO_COMMAND_KEY_PRESSED:
                text = getSelectedText();
                text && sendAudio(text, {});
                break;
            case SCTS_CALL_OUT_COMMAND_KEY_PRESSED:
                dispatch(callOutResultBox());
                break;
            case SCTS_CLOSE_COMMAND_KEY_PRESSED:
                dispatch(closeResultBox());
                break;
            default: break;
        }

        oldChromeMsg.current = chromeMsg;
    }, [chromeMsg, isEnableTranslate, handleForwardTranslate, dispatch, pos]);

    useGetSelection(({ text, pos }) => {
        if (!isEnableTranslate) { return; }

        if (doNotRespondInTextBox && isTextBox(document.activeElement)) { return; }

        const nextPos = calculateBtnPos(pos);

        if ((translateWithKeyPress && ctrlPressing.current) || translateDirectly || (pinning && translateDirectlyWhilePinning)) {
            handleForwardTranslate(text, nextPos);
            return;
        }

        setPos(nextPos);
        setText(text);
        if (showButtonAfterSelect) {
            setShowBtn(true);
            hideButtonAfterFixedTime && debounceHideButtonAfterFixedTime.current();
        }

        dispatch(requestToHidePanel());
    }, () => {
        setShowBtn(false);

        dispatch(requestToHidePanel());
    });

    useEffect(() => {
        debounceHideButtonAfterFixedTime.current = debounce(() => setShowBtn(false), hideButtonFixedTime);
    }, [hideButtonFixedTime]);

    return (
        <div
            className='ts-btn'
            style={{
                display: isEnableTranslate && showBtn ? 'block' : 'none',
                left: `${pos.x}px`,
                top: `${pos.y}px`
            }}
            onMouseUp={(e) => {
                setShowBtn(false);
                handleForwardTranslate(text, pos);
                e.stopPropagation();
            }}
            onMouseDown={e => e.stopPropagation()}
        >
            <IconFont iconName='#icon-MdTranslate' style={{display: 'block'}} />
        </div>
    );
};

export default TsBtn;