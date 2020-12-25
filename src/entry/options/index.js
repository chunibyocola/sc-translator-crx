import React from 'react';
import ReactDOM from 'react-dom';
import Options from './Options';
import './style.css';
import '../../styles/global.css';
import { getI18nMessage } from '../../public/chrome-call';

// inject style
import '../../public/inject-style';

document.body.id = 'sc-translator-root';
document.title = `${getI18nMessage('optionsTitle')} - ${getI18nMessage('extName')}`;

ReactDOM.render(
  <Options />,
  document.getElementById('root')
);