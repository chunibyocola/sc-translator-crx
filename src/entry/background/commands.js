/* global chrome */
import { getCurrentTab } from '../../public/utils';
import {
    SCTS_TRANSLATE_COMMAND_KEY_PRESSED,
    SCTS_AUDIO_COMMAND_KEY_PRESSED
} from '../../constants/chromeSendMessageTypes';

const SC_TRANSLATE = 'sc-translate';
const SC_AUDIO = 'sc-audio';

chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case SC_TRANSLATE:
            getCurrentTab(tab => tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_TRANSLATE_COMMAND_KEY_PRESSED }));
            break;
        case SC_AUDIO:
            getCurrentTab(tab => tab && chrome.tabs.sendMessage(tab.id, { type: SCTS_AUDIO_COMMAND_KEY_PRESSED }));
            break;
        default: break;
    }
});