import {GOOGLE_COM} from './translateSource';
import {LANG_EN} from './langCode';

const defaultOptions = {
    userLanguage: LANG_EN,
    enableContextMenus: true,
    defaultTranslateSource: GOOGLE_COM,
    defaultTranslateFrom: '',
    defaultTranslateTo: '',
    translateDirectly: false,
    translateBlackListMode: true,
    translateHostList: [],
    historyBlackListMode: false,
    historyHostList: [],
    darkMode: false,
    showButtonAfterSelect: true,
    defaultAudioSource: GOOGLE_COM,
    translateWithKeyPress: false
};

export default defaultOptions;