import React from 'react';
import { GenericOptionsProps } from '..';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import OptionToggle from '../../OptionToggle';

const initSizeAndPosition = { width: 286, height: 439, left: 550, top: 250 };

type SeparateWindowProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'rememberStwSizeAndPosition'
>>;

const SeparateWindow: React.FC<SeparateWindowProps> = ({ updateStorage, rememberStwSizeAndPosition }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsStwDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <div className='item-description'>{getMessage('optionsStwAutoRespondDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='remember-separate-window-size-and-position'
                    message='optionsRememberStwSizeAndPosition'
                    checked={rememberStwSizeAndPosition}
                    onClick={() => updateStorage('rememberStwSizeAndPosition', !rememberStwSizeAndPosition)}
                />
            </div>
            <div className='opt-section-row'>
                <button onClick={() => updateStorage('stwSizeAndPosition', initSizeAndPosition)}>
                    {getMessage('optionsResetSizeAndPosition')}
                </button>
            </div>
        </div>
    );
};

export default SeparateWindow;