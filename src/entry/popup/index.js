import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import '../../styles/global.css';

import Popup from '../../components/Popup';

import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initMultipleTranslate, initSingleTranslate } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import MtPopup from '../../components/MultipleTranslate/MtPopup';

// inject style
import '../../public/inject-style';

const init = (options) => {
    initOptions(options);

    options.multipleTranslateMode ? initMultipleTranslate(options) : initSingleTranslate(options);

    ReactDOM.render(
        <Provider store={store}>
            {options.multipleTranslateMode ? <MtPopup /> : <Popup />}
        </Provider>,
        document.getElementById('root')
    );
};

getLocalStorage(defaultOptions, init);