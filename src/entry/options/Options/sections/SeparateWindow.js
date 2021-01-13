import React from 'react';
import { getMessage } from '../../../../public/i18n';
import OptionToggle from '../../OptionToggle';

const initSizeAndPosition = { width: 286, height: 439, left: 550, top: 250 };

const SeparateWindow = ({ updateStorage, rememberStwSizeAndPosition }) => {
    return (
        <>
            <h3>{getMessage('titleSeparateWindow')}</h3>
            <div className='opt-item item-description'>
                {getMessage('optionsStwDescription')}
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
                    {getMessage('optionsResetSizeAndPosition')}
                </button>  
            </div>
        </>
    );
};

export default SeparateWindow;