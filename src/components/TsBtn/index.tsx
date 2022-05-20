import React, {useState, useEffect, useCallback, useRef} from 'react';
import { getSelectedText } from '../../public/utils/get-selection';
import { useOptions, useGetSelection, useAppSelector, useAppDispatch, useOnRuntimeMessage, useIsTranslateEnabled } from '../../public/react-use';
import {
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';
import IconFont from '../IconFont';
import './style.css';
import { sendSeparate } from '../../public/send';
import { debounce, isTextBox } from '../../public/utils';
import { DefaultOptions, Position } from '../../types';
import { callOutPanelInContentScript, closePanel, requestToHidePanel, showPanelAndSetPosition } from '../../redux/slice/panelStatusSlice';
import {
    translateButtonContext,
    TRANSLATE_BUTTON_COPY,
    TRANSLATE_BUTTON_LISTEN,
    TRANSLATE_BUTTON_TL_FIRST,
    TRANSLATE_BUTTON_TL_SECOND,
    TRANSLATE_BUTTON_TL_THIRD,
    TRANSLATE_BUTTON_TRANSLATE
} from '../../constants/translateButtonTypes';
import { playAudio } from '../../public/play-audio';
import { nextTranslaion } from '../../redux/slice/translationSlice';
import PanelIconButtonWrapper from '../PanelIconButtons/PanelIconButtonWrapper';

const initText = '';
const initPos = { x: 5, y: 5 };

type PickedOptions = Pick<
    DefaultOptions,
    'translateDirectly' |
    'translateWithKeyPress' |
    'hideButtonAfterFixedTime' |
    'hideButtonFixedTime' |
    'respondToSeparateWindow' |
    'translateDirectlyWhilePinning' |
    'doNotRespondInTextBox' |
    'translateButtons' |
    'translateButtonsTL' |
    'pinThePanelWhileOpeningIt' |
    'btnPosition'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'translateDirectly',
    'translateWithKeyPress',
    'hideButtonAfterFixedTime',
    'hideButtonFixedTime',
    'respondToSeparateWindow',
    'translateDirectlyWhilePinning',
    'doNotRespondInTextBox',
    'translateButtons',
    'translateButtonsTL',
    'pinThePanelWhileOpeningIt',
    'btnPosition'
];

const calculateBtnPos = ({ x, y }: Position, translateButtonElement: HTMLDivElement | null) => {
    const rect = translateButtonElement?.getBoundingClientRect();
    const btnHeight = rect?.height ?? 22;
    const btnWidth = rect?.width ?? 22;
    let tmpX = x, tmpY = y;

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

    if (tmpX + btnWidth + 5 > dW) tmpX = dW - btnWidth - 5;
    if (tmpX < 5) tmpX = 5;
    if (tmpY + btnHeight + 5 > dH) tmpY = dH - btnHeight - 5;
    if (tmpY < 5) tmpY = 5;

    return { x: tmpX, y: tmpY };
};

const TsBtn: React.FC = () => {
    const [showBtn, setShowBtn] = useState(false);
    const [pos, setPos] = useState(initPos);
    const [text, setText] = useState(initText);

    const ctrlPressing = useRef(false);
    const debounceHideButtonAfterFixedTime = useRef<ReturnType<typeof debounce>>();
    const translateButtonEleRef = useRef<HTMLDivElement>(null);

    const { pinning } = useAppSelector(state => state.panelStatus);

    const {
        translateDirectly,
        translateWithKeyPress,
        hideButtonAfterFixedTime,
        hideButtonFixedTime,
        respondToSeparateWindow,
        translateDirectlyWhilePinning,
        doNotRespondInTextBox,
        translateButtons,
        translateButtonsTL,
        pinThePanelWhileOpeningIt,
        btnPosition
    } = useOptions<PickedOptions>(useOptionsDependency);

    const translateEnabled = useIsTranslateEnabled(window.location.host);

    const dispatch = useAppDispatch();

    const handleForwardTranslate = useCallback((text: string, position: Position, to: undefined | string = undefined) => {
        if (respondToSeparateWindow) {
            sendSeparate(text);
            return;
        }

        dispatch(showPanelAndSetPosition({ position, pinThePanelWhileOpeningIt }));

        dispatch(nextTranslaion({ text, to }));
    }, [dispatch, respondToSeparateWindow, pinThePanelWhileOpeningIt]);

    const handleTranslateButtonClick = (translateButton: string) => {
        setShowBtn(false);

        switch (translateButton) {
            case TRANSLATE_BUTTON_TRANSLATE:
                handleForwardTranslate(text, pos);
                break;
            case TRANSLATE_BUTTON_LISTEN:
                playAudio({ text });
                break;
            case TRANSLATE_BUTTON_COPY:
                navigator.clipboard.writeText(text);
                break;
            case TRANSLATE_BUTTON_TL_FIRST:
                handleForwardTranslate(text, pos, translateButtonsTL.first);
                break;
            case TRANSLATE_BUTTON_TL_SECOND:
                handleForwardTranslate(text, pos, translateButtonsTL.second);
                break;
            case TRANSLATE_BUTTON_TL_THIRD:
                handleForwardTranslate(text, pos, translateButtonsTL.third);
                break;
            default: break;
        }
    };

    useEffect(() => {
        if (!translateWithKeyPress) return;

        const onKeyDown = (e: KeyboardEvent) => {
            e.key === 'Control' && !ctrlPressing.current && (ctrlPressing.current = true);
        };
        const onKeyUp = (e: KeyboardEvent) => {
            e.key === 'Control' && ctrlPressing.current && (ctrlPressing.current = false);
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        }
    }, [translateWithKeyPress]);

    useOnRuntimeMessage(({ type, payload }) => {
        if (!translateEnabled) { return; }

        switch (type) {
            case SCTS_CONTEXT_MENUS_CLICKED: {
                setShowBtn(false);
                const { text } = payload;
                text && handleForwardTranslate(text, pos);
                break;
            }
            case SCTS_TRANSLATE_COMMAND_KEY_PRESSED: {
                setShowBtn(false);
                const text = getSelectedText();
                text && handleForwardTranslate(text, pos);
                break;
            }
            case SCTS_AUDIO_COMMAND_KEY_PRESSED: {
                const text = getSelectedText();
                text && playAudio({ text });
                break;
            }
            case SCTS_CALL_OUT_COMMAND_KEY_PRESSED: {
                dispatch(callOutPanelInContentScript({ pinThePanelWhileOpeningIt }));
                break;
            }
            case SCTS_CLOSE_COMMAND_KEY_PRESSED: {
                dispatch(closePanel());
                break;
            }
            default: break;
        }
    });

    useGetSelection(({ text, pos }) => {
        if (!translateEnabled) { return; }

        if (doNotRespondInTextBox && document.activeElement && isTextBox(document.activeElement)) { return; }

        const posWithBtnPosition: Position = { x: pos.x + btnPosition.x, y: pos.y + btnPosition.y };

        if ((translateWithKeyPress && ctrlPressing.current) || translateDirectly || (pinning && translateDirectlyWhilePinning)) {
            handleForwardTranslate(text, calculateBtnPos(posWithBtnPosition, null));
            return;
        }

        setText(text);
        if (translateButtons.length > 0) {
            setShowBtn(true);
            setPos(calculateBtnPos(posWithBtnPosition, translateButtonEleRef.current));
            hideButtonAfterFixedTime && debounceHideButtonAfterFixedTime.current?.();
        }
        else {
            setPos(calculateBtnPos(posWithBtnPosition, null));
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
            ref={translateButtonEleRef}
            className='translate-button'
            style={{
                display: translateEnabled && showBtn && translateButtons.length > 0 ? 'flex' : 'none',
                left: `${pos.x}px`,
                top: `${pos.y}px`
            }}
            onMouseUp={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
        >
            {translateButtons.map((translateButton) => (translateButtonContext[translateButton].type === 'icon' && <PanelIconButtonWrapper
                key={translateButton}
                onClick={() => handleTranslateButtonClick(translateButton)}
            >
                <IconFont iconName={translateButtonContext[translateButton].iconName} />
            </PanelIconButtonWrapper>))}
        </div>
    );
};

export default TsBtn;