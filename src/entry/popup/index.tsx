import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './style.css';
import '../../styles/global.css';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation } from '../../redux/init';
import { appendColorVarsStyle, appendCustomizeStyle, appendFontSizeStyle } from '../../public/inject-style';
import ResultBox from './ResultBox';
import scOptions from '../../public/sc-options';

scOptions.init().then((options) => {
    appendColorVarsStyle(document.head);
    appendFontSizeStyle(document.head);
    appendCustomizeStyle(document.head);

    initTranslation({
        sourceList: options.multipleTranslateSourceList,
        from: options.multipleTranslateFrom,
        to: options.multipleTranslateTo
    });

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Provider store={store}>
            <ResultBox />
        </Provider>
    );
});