/* global chrome */
import { getCurrentTab } from '../../public/utils';
import {
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED,
    SCTS_CALL_OUT_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';

const SC_TRANSLATE = 'sc-translate';
const SC_AUDIO = 'sc-audio';
const SC_CALL_OUT = 'sc-call-out';

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
        default: break;
    }
});