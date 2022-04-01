import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './style.css';
import '../../styles/global.css';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initMultipleTranslate } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import HandleCommand from './HandleCommands';
import Separate from './Separate';
import { getI18nMessage } from '../../public/chrome-call';
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import { DefaultOptions } from '../../types';

document.title = `${getI18nMessage('titleSeparateWindow')} - ${getI18nMessage('extName')}`;

const init = (options: DefaultOptions) => {
    document.body.id = 'sc-translator-root';

    initOptions(options);

    appendColorVarsStyle(document.head);
    appendFontSizeStyle(document.head);
    appendCustomizeStyle(document.head);

    initMultipleTranslate(options);

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <HandleCommand />
            <Separate />
        </Provider>
    );
};

getLocalStorage<DefaultOptions>(defaultOptions, init);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') {
        sendResponse('Yes!');
    }
    else if (request === 'Are you separate window?') {
        chrome.tabs.getCurrent().then((tab) => {
            if (tab) {
                sendResponse({ tabId: tab.id, windowId: tab.windowId });
            }
            else {
                sendResponse(null);
            }
        });

        return true;
    }
});