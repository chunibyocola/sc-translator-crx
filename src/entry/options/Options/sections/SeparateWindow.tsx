import React from 'react';
import { GenericOptionsProps } from '..';
import Button from '../../../../components/Button';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';

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
                <div className='item-description'>{getMessage('optionsStwAutoRespondDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberStwSizeAndPosition')}
                    checked={rememberStwSizeAndPosition}
                    onChange={v => updateStorage('rememberStwSizeAndPosition', v)}
                />
            </div>
            <div className='opt-section-row'>
                <Button variant='outlined' onClick={() => updateStorage('stwSizeAndPosition', initSizeAndPosition)}>
                    {getMessage('optionsResetSizeAndPosition')}
                </Button>
            </div>
        </div>
    );
};

export default SeparateWindow;