import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './style.css';
import '../../styles/global.css';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation } from '../../redux/init';
import HandleCommand from './HandleCommands';
import Separate from './Separate';
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import { getMessage } from '../../public/i18n';
import scOptions from '../../public/sc-options';

document.title = `${getMessage('extName')}`;

scOptions.init().then((options) => {
    document.body.id = 'sc-translator-root';

    appendColorVarsStyle(document.head);
    appendFontSizeStyle(document.head);
    appendCustomizeStyle(document.head);

    initTranslation({
        sourceList: options.multipleTranslateSourceList,
        from: options.multipleTranslateFrom,
        to:options.multipleTranslateTo
    });

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <HandleCommand />
            <Separate />
        </Provider>
    );
});

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