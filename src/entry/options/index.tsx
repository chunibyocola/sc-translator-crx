import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Options from './Options';
import './style.css';
import '../../styles/global.css';
import { getLocalStorageAsync } from '../../public/utils';
import { DefaultOptions } from '../../types';
import defaultOptions from '../../constants/defaultOptions';
import { initOptions } from '../../public/options';
import { getMessage } from '../../public/i18n';

document.title = `${getMessage('optionsTitle')} - ${getMessage('extName')}`;

getLocalStorageAsync<DefaultOptions>(Object.keys(defaultOptions) as (keyof DefaultOptions)[]).then((options) => {
    initOptions(options);

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Options />
    );
})