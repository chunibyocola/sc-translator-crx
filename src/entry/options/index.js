import React from 'react';
import ReactDOM from 'react-dom';
import Options from '../../components/Options';
import './style.css';
import '../../styles/global.css';

// inject style
import '../../public/inject-style';

document.body.id = 'sc-translator-root';

ReactDOM.render(
  <Options />,
  document.getElementById('root')
);