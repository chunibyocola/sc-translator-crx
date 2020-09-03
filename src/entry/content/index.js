import React from 'react';
import ReactDOM from 'react-dom';
import TsBtn from '../../components/TsBtn';
import TsHistory from '../../components/TsHistory';
import ResultBox from '../../components/ResultBox';
import MultipleTranslate from '../../components/MultipleTranslate';

import { Provider } from 'react-redux';
import store from '../../redux/store';

import { initTranslation, initMultipleTranslate } from '../../redux/init';
import { initOptions, listenOptionsChange } from '../../public/options';
import { getLocalStorage, onExtensionMessage } from '../../public/chrome-call';
import defaultOptions from '../../constants/defaultOptions';

import '../../styles/global.css';

const init = (options) => {
  initOptions(options);

  options.multipleTranslateMode ? initMultipleTranslate(options) : initTranslation(options);

  const app = document.createElement('div');
  app.id = 'sc-translator-root';
  app.className = options.darkMode ? 'dark' : 'light';

  listenOptionsChange(['darkMode'], (opts) => {
    app.className = opts.darkMode ? 'dark' : 'light';
  });

  document.body.appendChild(app);
  ReactDOM.render(
    <Provider store={store}>
      <TsBtn multipleTranslateMode={options.multipleTranslateMode} />
      {options.multipleTranslateMode ? <MultipleTranslate /> : <><TsHistory /><ResultBox /></>}
    </Provider>, 
    app
  );
};

getLocalStorage(defaultOptions, init);

onExtensionMessage((request, sender, sendResponse) => {
  if (request === 'Are you enabled?') sendResponse('Yes!');
});