import React from 'react';
import { getMessage } from '../../../public/i18n';
import './style.css';

const dataOfDisplayMode = [{
    id: 'wpt-original-text',
    value: 0,
    message: getMessage('optionsOriginalText')
}, {
    id: 'wpt-original-text-translation',
    value: 1,
    message: `${getMessage('optionsOriginalText')} + ${getMessage('optionsTranslation')}`
}, {
    id: 'wpt-translation',
    value: 2,
    message: getMessage('optionsTranslation')
}];

type WebPageTranslateDisplayModeProps = {
    update: (displayMode: number) => void;
    displayMode: number;
};

const WebPageTranslateDisplayMode: React.FC<WebPageTranslateDisplayModeProps> = ({ update, displayMode }) => {
    return (
        <div className='wpt-display-mode'>
            {dataOfDisplayMode.map((item) => (<div key={item.id} className='wpt-display-mode__item'>
                <input
                    type='radio'
                    name='wpt-display-mode'
                    value={item.value}
                    id={item.id}
                    checked={displayMode === item.value}
                    onChange={() => update(item.value)}
                />
                <label htmlFor={item.id} className='button'>{item.message}</label>
            </div>))}
        </div>
    );
};

export default WebPageTranslateDisplayMode;