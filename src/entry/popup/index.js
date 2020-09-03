import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import '../../styles/global.css';

import Popup from '../../components/Popup';

import { Provider } from 'react-redux';
import store from '../../redux/store';
import { initTranslation, initMultipleTranslate } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getLocalStorage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import MtPopup from '../../components/MultipleTranslate/MtPopup';

const init = (options) => {
    initOptions(options);

    //initTranslation(options);
    options.multipleTranslateMode ? initMultipleTranslate(options) : initTranslation(options);

    ReactDOM.render(
        <Provider store={store}>
            {options.multipleTranslateMode ? <MtPopup /> : <Popup />}
        </Provider>,
        document.getElementById('root')
    );
};

getLocalStorage(defaultOptions, init);