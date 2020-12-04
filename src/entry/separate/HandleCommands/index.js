import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CONTEXT_MENUS_CLICKED,
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED
} from '../../../constants/chromeSendMessageTypes';
import { useOnExtensionMessage } from '../../../public/react-use';
import { sendAudio } from '../../../public/send';
import { getSelectedText } from '../../../public/utils/get-selection';
import { mtSetText } from '../../../redux/actions/multipleTranslateActions';
import { callOutResultBox } from '../../../redux/actions/resultBoxActions';

const HandleCommands = () => {
    const dispatch = useDispatch();

    const chromeMsg = useOnExtensionMessage();

    useEffect(() => {
        const { type, payload } = chromeMsg;
        let text;

        switch (type) {
            case SCTS_CONTEXT_MENUS_CLICKED:
                const { selectionText } = payload;
                selectionText && dispatch(mtSetText({ text }));
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
                dispatch(callOutResultBox());
                break;
            default: break;
        }
    }, [chromeMsg, dispatch]);

    return null;
};

export default HandleCommands;