import React from 'react';
import ReactDOM from 'react-dom';
import Options from '../../components/Options';
import './style.css';
import '../../styles/global.css';

document.body.id = 'sc-translator-root';

ReactDOM.render(
  <Options />,
  document.getElementById('root')
);