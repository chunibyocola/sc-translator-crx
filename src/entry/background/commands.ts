import { getCurrentTab } from '../../public/utils';
import {
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED,
    SCTS_CLOSE_COMMAND_KEY_PRESSED,
    SCTS_TRANSLATE_CURRENT_PAGE
} from '../../constants/chromeSendMessageTypes';
import { SC_AUDIO, SC_TRANSLATE, SC_CALL_OUT, SC_OPEN_SEPARATE_WINDOW, SC_CLOSE, SC_TOGGLE_AUTO_INSERT_RESULT, SC_TRANSLATE_CURRENT_PAGE } from '../../constants/commandsName';
import { createSeparateWindow } from './separate-window';
import { getLocalStorage, setLocalStorage } from '../../public/chrome-call';

chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case SC_TRANSLATE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_COMMAND_KEY_PRESSED }));
            break;
        case SC_AUDIO:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_AUDIO_COMMAND_KEY_PRESSED }));
            break;
        case SC_CALL_OUT:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_CALL_OUT_COMMAND_KEY_PRESSED }));
            break;
        case SC_OPEN_SEPARATE_WINDOW:
            createSeparateWindow();
            break;
        case SC_CLOSE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_CLOSE_COMMAND_KEY_PRESSED }));
            break;
        case SC_TOGGLE_AUTO_INSERT_RESULT:
            getLocalStorage('autoInsertResult', data => setLocalStorage({ 'autoInsertResult': !data.autoInsertResult }));
            break;
        case SC_TRANSLATE_CURRENT_PAGE:
            getCurrentTab(tab => tab?.id !== undefined && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_CURRENT_PAGE }));
            break;
        default: break;
    }
});