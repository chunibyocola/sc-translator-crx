import React from 'react';
import ReactDOM from 'react-dom';
import defaultOptions from '../../constants/defaultOptions';
import { getMessage } from '../../public/i18n';
import { initOptions } from '../../public/options';
import { getLocalStorageAsync } from '../../public/utils';
import { DefaultOptions } from '../../types';
import Collection from './Collection';
import '../../styles/global.css';
import './style.css';

document.title = `${getMessage('collectionTitle')} - ${getMessage('extName')}`;

getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]).then((options) => {
    document.documentElement.id = 'sc-translator-root';

    initOptions(options);

    ReactDOM.render(
        <Collection />,
        document.getElementById('root')
    );
});