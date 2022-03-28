import React from 'react';
import {
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED,
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_SEPARATE_WINDOW_SET_TEXT,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED
} from '../../../constants/chromeSendMessageTypes';
import { playAudio } from '../../../public/play-audio';
import { useAppDispatch, useOnRuntimeMessage } from '../../../public/react-use';
import { getSelectedText } from '../../../public/utils/get-selection';
import { mtSetText } from '../../../redux/slice/multipleTranslateSlice';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';

const HandleCommands: React.FC = () => {
    const dispatch = useAppDispatch();

    useOnRuntimeMessage(({ type, payload }) => {
        switch (type) {
            case SCTS_CONTEXT_MENUS_CLICKED: {
                const { text } = payload;
                text && dispatch(mtSetText({ text }));
                break;
            }
            case SCTS_TRANSLATE_COMMAND_KEY_PRESSED: {
                const text = getSelectedText();
                text && dispatch(mtSetText({ text }));
                break;
            }
            case SCTS_AUDIO_COMMAND_KEY_PRESSED: {
                const text = getSelectedText();
                text && playAudio({ text });
                break;
            }
            case SCTS_CALL_OUT_COMMAND_KEY_PRESSED: {
                dispatch(callOutPanel());
                break;
            }
            case SCTS_SEPARATE_WINDOW_SET_TEXT: {
                const { text } = payload;
                text && dispatch(mtSetText({ text }));
                break;
            }
            case SCTS_CLOSE_COMMAND_KEY_PRESSED: {
                window.close();
                break;
            }
            default: break;
        }
    });

    return null;
};

export default HandleCommands;