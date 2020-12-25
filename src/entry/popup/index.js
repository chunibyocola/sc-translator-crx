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

// inject style
import '../../public/inject-style';
import ResultBox from './ResultBox';

const init = (options) => {
    initOptions(options);

    options.multipleTranslateMode ? initMultipleTranslate(options) : initSingleTranslate(options);

    ReactDOM.render(
        <Provider store={store}>
            <ResultBox multipleTranslateMode={options.multipleTranslateMode} />
        </Provider>,
        document.getElementById('root')
    );
};

getLocalStorage(defaultOptions, init);