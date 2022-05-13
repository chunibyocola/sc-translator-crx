import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './style.css';
import '../../styles/global.css';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import ResultBox from './ResultBox';
import { DefaultOptions } from '../../types';

const init = (options: DefaultOptions) => {
    initOptions(options);

    appendColorVarsStyle(document.head);
    appendFontSizeStyle(document.head);
    appendCustomizeStyle(document.head);

    initTranslation({
        sourceList: options.multipleTranslateMode ? options.multipleTranslateSourceList : [options.defaultTranslateSource],
        from: options.multipleTranslateMode ? options.multipleTranslateFrom : options.defaultTranslateFrom,
        to: options.multipleTranslateMode ? options.multipleTranslateTo : options.defaultTranslateTo
    });

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <ResultBox multipleTranslateMode={options.multipleTranslateMode} />
        </Provider>
    );
};

getLocalStorage<DefaultOptions>(defaultOptions, init);