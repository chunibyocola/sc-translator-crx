import { getCurrentTab } from '../../public/utils';
import {
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';
import { SC_AUDIO, SC_TRANSLATE, SC_CALL_OUT, SC_OPEN_SEPARATE_WINDOW, SC_CLOSE } from '../../constants/commandsName';
import { createSeparateWindow } from './separate-window';

chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case SC_TRANSLATE:
            getCurrentTab(tab => tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_COMMAND_KEY_PRESSED }));
            break;
        case SC_AUDIO:
            getCurrentTab(tab => tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_AUDIO_COMMAND_KEY_PRESSED }));
            break;
        case SC_CALL_OUT:
            getCurrentTab(tab => tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED }));
            break;
        case SC_OPEN_SEPARATE_WINDOW:
            createSeparateWindow();
            break;
        case SC_CLOSE:
            getCurrentTab(tab => tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_CLOSE_COMMAND_KEY_PRESSED }));
            break;
        default: break;
    }
});