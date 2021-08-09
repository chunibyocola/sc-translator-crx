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
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import { DefaultOptions } from '../../types';

document.title = `${getI18nMessage('titleSeparateWindow')} - ${getI18nMessage('extName')}`;

const init = (options: DefaultOptions) => {
    initOptions(options);

    appendColorVarsStyle(document.head);
    appendFontSizeStyle(document.head);
    appendCustomizeStyle(document.head);

    initMultipleTranslate(options);

    ReactDOM.render(
        <Provider store={store}>
            <HandleCommand />
            <Separate />
        </Provider>,
        document.body
    );
};

getLocalStorage<DefaultOptions>(defaultOptions, init);

onExtensionMessage((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') sendResponse('Yes!');
});