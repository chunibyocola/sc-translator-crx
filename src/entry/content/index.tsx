import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import TsBtn from '../../components/TsBtn';
import TsHistory from '../../components/TsHistory';
import ResultBox from './ResultBox';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getExtensionURL, getLocalStorage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import '../../styles/global.css';
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import { DefaultOptions } from '../../types';
import WebPageTranslate from './WebPageTranslate';

const init = (options: DefaultOptions) => {
    initOptions(options);

    initTranslation({
        sourceList: options.multipleTranslateMode ? options.multipleTranslateSourceList : [options.defaultTranslateSource],
        from: options.multipleTranslateMode ? options.multipleTranslateFrom : options.defaultTranslateFrom,
        to: options.multipleTranslateMode ? options.multipleTranslateTo : options.defaultTranslateTo
    });

    const root = document.createElement('div');
    root.id = 'sc-translator-shadow';
    root.setAttribute('style', 'all: initial;');
    document.documentElement.appendChild(root);

    const shadowRoot = root.attachShadow({ mode: 'open' });

    const contentStyle = document.createElement('link');
    contentStyle.rel = 'stylesheet';
    contentStyle.href = getExtensionURL('/static/css/content.css');
    shadowRoot.appendChild(contentStyle);

    appendColorVarsStyle(shadowRoot);
    appendFontSizeStyle(shadowRoot);
    appendCustomizeStyle(shadowRoot);

    const rootWrapper = document.createElement('div');
    rootWrapper.setAttribute('style', 'all: initial;');
    shadowRoot.appendChild(rootWrapper);

    const rootElement = document.createElement('div');
    rootElement.id = 'sc-translator-root';
    rootWrapper.appendChild(rootElement);

    contentStyle.onload = () => ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <TsBtn />
            <TsHistory />
            <ResultBox multipleTranslateMode={options.multipleTranslateMode} />
            <WebPageTranslate />
        </Provider>
    );
};

getLocalStorage<DefaultOptions>(defaultOptions, init);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') sendResponse({ host: window.location.host });
});