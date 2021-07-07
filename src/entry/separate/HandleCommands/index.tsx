import { useEffect } from 'react';
import {
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED,
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_SEPARATE_WINDOW_SET_TEXT,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED
} from '../../../constants/chromeSendMessageTypes';
import { useAppDispatch, useOnExtensionMessage } from '../../../public/react-use';
import { sendAudio } from '../../../public/send';
import { getSelectedText } from '../../../public/utils/get-selection';
import { mtSetText } from '../../../redux/slice/multipleTranslateSlice';
import { callOutPanel } from '../../../redux/slice/panelStatusSlice';

const HandleCommands: React.FC = () => {
    const dispatch = useAppDispatch();

    const chromeMsg = useOnExtensionMessage();

    useEffect(() => {
        const { type, payload } = chromeMsg;
        let text;

        switch (type) {
            case SCTS_CONTEXT_MENUS_CLICKED:
                const { selectionText } = payload;
                selectionText && dispatch(mtSetText({ text: selectionText }));
                break;
            case SCTS_TRANSLATE_COMMAND_KEY_PRESSED:
                text = getSelectedText();
                text && dispatch(mtSetText({ text }));
                break;
            case SCTS_AUDIO_COMMAND_KEY_PRESSED:
                text = getSelectedText();
                text && sendAudio(text, {});
                break;
            case SCTS_CALL_OUT_COMMAND_KEY_PRESSED:
                dispatch(callOutPanel());
                break;
            case SCTS_SEPARATE_WINDOW_SET_TEXT:
                payload.text && dispatch(mtSetText({ text: payload.text }));
                break;
            case SCTS_CLOSE_COMMAND_KEY_PRESSED:
                window.close();
                break;
            default: break;
        }
    }, [chromeMsg, dispatch]);

    return null;
};

export default HandleCommands;