import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import defaultOptions from '../../constants/defaultOptions';
import { getMessage } from '../../public/i18n';
import { initOptions } from '../../public/options';
import { getLocalStorageAsync } from '../../public/utils';
import { DefaultOptions } from '../../types';
import Collection from './App';
import '../../styles/global.css';
import './style.css';

document.title = `${getMessage('collectionTitle')} - ${getMessage('extName')}`;

getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]).then((options) => {
    document.documentElement.id = 'sc-translator-root';

    initOptions(options);

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Collection />
    );
});