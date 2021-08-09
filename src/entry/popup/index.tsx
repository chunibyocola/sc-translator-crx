import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import '../../styles/global.css';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initMultipleTranslate, initSingleTranslate } from '../../redux/init';
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

    options.multipleTranslateMode ? initMultipleTranslate(options) : initSingleTranslate(options);

    ReactDOM.render(
        <Provider store={store}>
            <ResultBox multipleTranslateMode={options.multipleTranslateMode} />
        </Provider>,
        document.getElementById('root')
    );
};

getLocalStorage<DefaultOptions>(defaultOptions, init);