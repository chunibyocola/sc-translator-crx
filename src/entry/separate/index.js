import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import '../../styles/global.css';

import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initMultipleTranslate } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getLocalStorage, onExtensionMessage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import HandleCommand from './HandleCommands';
import Separate from './Separate';
import { getI18nMessage } from '../../public/chrome-call';
import { injectFontSizeStyle, injectThemeStyle } from '../../public/inject-style';

document.title = `${getI18nMessage('titleSeparateWindow')} - ${getI18nMessage('extName')}`;

const init = (options) => {
    initOptions(options);

    injectThemeStyle();
    injectFontSizeStyle();

    initMultipleTranslate(options);

    ReactDOM.render(
        <Provider store={store}>
            <HandleCommand />
            <Separate />
        </Provider>,
        document.body
    );
};

getLocalStorage(defaultOptions, init);

onExtensionMessage((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') sendResponse('Yes!');
});