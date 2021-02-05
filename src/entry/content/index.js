import React from 'react';
import ReactDOM from 'react-dom';
import TsBtn from '../../components/TsBtn';
import TsHistory from '../../components/TsHistory';
import ResultBox from './ResultBox';

import { Provider } from 'react-redux';
import store from '../../redux/store';

import { initMultipleTranslate, initSingleTranslate } from '../../redux/init';
import { initOptions } from '../../public/options';
import { getLocalStorage, onExtensionMessage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';

import '../../styles/global.css';

// inject style
import '../../public/inject-style';

const init = (options) => {
  initOptions(options);

  options.multipleTranslateMode ? initMultipleTranslate(options) : initSingleTranslate(options);

  const app = document.createElement('div');
  app.id = 'sc-translator-root';

  document.body.appendChild(app);
  ReactDOM.render(
    <Provider store={store}>
      <TsBtn multipleTranslateMode={options.multipleTranslateMode} />
      <TsHistory />
      <ResultBox multipleTranslateMode={options.multipleTranslateMode} />
    </Provider>, 
    app
  );
};

getLocalStorage(defaultOptions, init);

onExtensionMessage((request, sender, sendResponse) => {
  if (request === 'Are you enabled?') sendResponse({ host: window.location.host });
});