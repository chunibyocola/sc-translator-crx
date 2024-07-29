import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { getMessage } from '../../public/i18n';
import Collection from './App';
import '../../styles/global.css';
import './style.css';
import scOptions from '../../public/sc-options';

document.title = `${getMessage('collectionTitle')} - ${getMessage('extName')}`;

scOptions.init().then(() => {
    document.documentElement.id = 'sc-translator-root';

    const rootElement = document.getElementById('root');

    rootElement && ReactDOMClient.createRoot(rootElement).render(
        <Collection />
    );
});