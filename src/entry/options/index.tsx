import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import Options from './Options';
import './style.css';
import '../../styles/global.css';
import { getMessage } from '../../public/i18n';
import scOptions from '../../public/sc-options';

document.title = `${getMessage('optionsTitle')} - ${getMessage('extName')}`;

scOptions.init().then(() => {
    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Options />
    );
})