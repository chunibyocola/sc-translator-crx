import React from 'react';
import { getI18nMessage } from '../../../../public/chrome-call';
import OptionToggle from '../../OptionToggle';

const initSizeAndPosition = { width: 286, height: 439, left: 550, top: 250 };

const SeparateWindow = ({ updateStorage, rememberStwSizeAndPosition }) => {
    return (
        <>
            <h3>{getI18nMessage('titleSeparateWindow')}</h3>
            <div className='opt-item item-description'>
                {getI18nMessage('optionsStwDescription')}
            </div>
            <div className='opt-item'>
                <OptionToggle
                    id='remember-separate-window-size-and-position'
                    message='optionsRememberStwSizeAndPosition'
                    checked={rememberStwSizeAndPosition}
                    onClick={() => updateStorage('rememberStwSizeAndPosition', !rememberStwSizeAndPosition)}
                />
            </div>
            <div className='opt-item'>
                <button onClick={() => updateStorage('stwSizeAndPosition', initSizeAndPosition)}>
                    {getI18nMessage('optionsResetSizeAndPosition')}
                </button>  
            </div>
        </>
    );
};

export default SeparateWindow;