import {contentText, translateText, optionsText, popupText} from '../constants/localization';
import {getOptions} from './options';

export const getContentText = (targetText) => {
    return contentText[targetText][getOptions().userLanguage];
};

export const getTranslateText = (targetText) => {
    return translateText[targetText][getOptions().userLanguage];
};

export const getOptionsText = (targetText) => {
    return optionsText[targetText][getOptions().userLanguage];
};

export const getPopupText = (targetText) => {
    return popupText[targetText][getOptions().userLanguage];
};