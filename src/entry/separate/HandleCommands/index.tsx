import React from 'react';
import {
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED,
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_OPEN_SEPARATE_WINDOW_COMMAND_KEY_PRESSED,
    SCTS_SEPARATE_WINDOW_SET_TEXT,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED
} from '../../../constants/chromeSendMessageTypes';
import { playAudio } from '../../../public/play-audio';
import { useAppDispatch, useOnRuntimeMessage, useOptions } from '../../../public/react-use';
import { getSelectedText } from '../../../public/utils/get-selection';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';
import { nextTranslaion } from '../../../redux/slice/translationSlice';
import { GetStorageKeys } from '../../../types';

const useOptionsDependency: GetStorageKeys<'autoPasteInTheInputBox'> = ['autoPasteInTheInputBox'];

const HandleCommands: React.FC = () => {
    const { autoPasteInTheInputBox } = useOptions(useOptionsDependency);

    const dispatch = useAppDispatch();

    useOnRuntimeMessage(async ({ type, payload }) => {
        switch (type) {
            case SCTS_CONTEXT_MENUS_CLICKED: {
                const { text } = payload;
                text && dispatch(nextTranslaion({ text }));
                break;
            }
            case SCTS_TRANSLATE_COMMAND_KEY_PRESSED: {
                const text = getSelectedText();
                text && dispatch(nextTranslaion({ text }));
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
                text && dispatch(nextTranslaion({ text }));
                break;
            }
            case SCTS_CLOSE_COMMAND_KEY_PRESSED: {
                window.close();
                break;
            }
            case SCTS_OPEN_SEPARATE_WINDOW_COMMAND_KEY_PRESSED: {
                const text = autoPasteInTheInputBox && await navigator.clipboard.readText().catch(() => null);
                text && dispatch(nextTranslaion({ text }));
                dispatch(callOutPanel());
                break;
            }
            default: break;
        }
    });

    return null;
};

export default HandleCommands;