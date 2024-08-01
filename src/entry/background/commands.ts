import { getCurrentTab } from '../../public/utils';
import {
    SC_AUDIO,
    SC_TRANSLATE,
    SC_CALL_OUT,
    SC_OPEN_SEPARATE_WINDOW,
    SC_CLOSE,
    SC_TOGGLE_AUTO_INSERT_RESULT,
    SC_TRANSLATE_CURRENT_PAGE,
    SC_SWITCH_WT_DISPLAY_MODE,
    SC_TOGGLE_PAGE_TRANSLATION_STATE
} from '../../constants/commandsName';
import { createSeparateWindow } from './separate-window';
import {
    sendTabsAudioCommandKeyPressed,
    sendTabsCallOutCommandKeyPressed,
    sendTabsCloseCommandKeyPressed,
    sendTabsSwitchWtDisplayMode,
    sendTabsTogglePageTranslationState,
    sendTabsTranslateCommandKeyPressed,
    sendTabsTranslateCurrentPage
} from '../../public/send';
import scOptions from '../../public/sc-options';

chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case SC_TRANSLATE:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsTranslateCommandKeyPressed(tab.id));
            break;
        case SC_AUDIO:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsAudioCommandKeyPressed(tab.id));
            break;
        case SC_CALL_OUT:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsCallOutCommandKeyPressed(tab.id));
            break;
        case SC_OPEN_SEPARATE_WINDOW:
            createSeparateWindow();
            break;
        case SC_CLOSE:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsCloseCommandKeyPressed(tab.id));
            break;
        case SC_TOGGLE_AUTO_INSERT_RESULT:
            scOptions.get(['autoInsertResult']).then(data => scOptions.set({ autoInsertResult: !data.autoInsertResult }));
            break;
        case SC_TRANSLATE_CURRENT_PAGE:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsTranslateCurrentPage(tab.id));
            break;
        case SC_SWITCH_WT_DISPLAY_MODE:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsSwitchWtDisplayMode(tab.id));
            break;
        case SC_TOGGLE_PAGE_TRANSLATION_STATE:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsTogglePageTranslationState(tab.id));
            break;
        default: break;
    }
});