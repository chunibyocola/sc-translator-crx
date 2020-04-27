import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';

import Popup from '../../components/Popup';

import {Provider} from 'react-redux';
import store from '../../redux/store';
import {initTranslation} from '../../redux/init';
import {initOptions} from '../../public/options';
import {getLocalStorage} from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';

const init = (options) => {
    initOptions(options);

    initTranslation(options);

    ReactDOM.render(
        <Provider store={store}>
            <Popup />
        </Provider>,
        document.getElementById('root')
    );
};

getLocalStorage(defaultOptions, init);