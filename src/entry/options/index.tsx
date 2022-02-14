import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import './style.css';
import '../../styles/global.css';
import { getI18nMessage } from '../../public/chrome-call';
import { getLocalStorageAsync } from '../../public/utils';
import { DefaultOptions } from '../../types';
import defaultOptions from '../../constants/defaultOptions';
import { initOptions } from '../../public/options';

document.documentElement.id = 'sc-translator-root';
document.title = `${getI18nMessage('optionsTitle')} - ${getI18nMessage('extName')}`;

getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]).then((options) => {
    initOptions(options);

    ReactDOM.render(
        <Options />,
        document.getElementById('root')
    );
})