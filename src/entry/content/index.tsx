import React from 'react';
import ReactDOM from 'react-dom';
import TsBtn from '../../components/TsBtn';
import TsHistory from '../../components/TsHistory';
import ResultBox from './ResultBox';

import { Provider } from 'react-redux';
import store from '../../redux/store';

import { initMultipleTranslate, initSingleTranslate } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getExtensionURL, getLocalStorage, onExtensionMessage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';

import '../../styles/global.css';
import { appendColorVarsStyle, appendFontSizeStyle } from '../../public/inject-style';
import { DefaultOptions } from '../../types';
import WebPageTranslate from './WebPageTranslate';

const init = (options: DefaultOptions) => {
    initOptions(options);

    options.multipleTranslateMode ? initMultipleTranslate(options) : initSingleTranslate(options);

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

    const div = document.createElement('div');
    div.setAttribute('style', 'all: initial;');
    shadowRoot.appendChild(div);

    const app = document.createElement('div');
    app.id = 'sc-translator-root';
    div.appendChild(app);

    contentStyle.onload = () => ReactDOM.render(
        <Provider store={store}>
            <TsBtn />
            <TsHistory />
            <ResultBox multipleTranslateMode={options.multipleTranslateMode} />
            <WebPageTranslate />
        </Provider>,
        app
    );
};

getLocalStorage<DefaultOptions>(defaultOptions, init);

onExtensionMessage((request, sender, sendResponse) => {
    if (request === 'Are you enabled?') sendResponse({ host: window.location.host });
});