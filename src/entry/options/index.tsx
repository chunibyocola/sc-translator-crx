import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import './style.css';
import '../../styles/global.css';
import { getI18nMessage } from '../../public/chrome-call';
import { appendColorVarsStyle } from '../../public/inject-style';

appendColorVarsStyle(document.head);

document.documentElement.id = 'sc-translator-root';
document.title = `${getI18nMessage('optionsTitle')} - ${getI18nMessage('extName')}`;

ReactDOM.render(
    <Options />,
    document.getElementById('root')
);